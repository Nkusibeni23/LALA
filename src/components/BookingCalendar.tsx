"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isWithinInterval, isSameDay, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { BookedDate } from "@/types/Booking";
import { Property } from "@/types/HomePage";
import { Session } from "next-auth";

interface BookingCalendarProps {
  property: Property;
  session: Session | null;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  bookedDates: BookedDate[];
}

const BookingCalendar = ({
  date,
  setDate,
  bookedDates,
}: BookingCalendarProps) => {
  const isDateBooked = React.useCallback(
    (date: Date) => {
      if (!bookedDates?.length) return false;

      return bookedDates.some((booking) => {
        if (!booking.checkIn || !booking.checkOut) return false;

        const checkIn =
          typeof booking.checkIn === "string"
            ? parseISO(booking.checkIn)
            : booking.checkIn;
        const checkOut =
          typeof booking.checkOut === "string"
            ? parseISO(booking.checkOut)
            : booking.checkOut;

        return isWithinInterval(date, {
          start: checkIn,
          end: checkOut,
        });
      });
    },
    [bookedDates]
  );

  const isBookingBoundary = React.useCallback(
    (date: Date) => {
      if (!bookedDates?.length) return false;

      return bookedDates.some((booking) => {
        if (!booking.checkIn || !booking.checkOut) return false;

        const checkIn =
          typeof booking.checkIn === "string"
            ? parseISO(booking.checkIn)
            : booking.checkIn;
        const checkOut =
          typeof booking.checkOut === "string"
            ? parseISO(booking.checkOut)
            : booking.checkOut;

        return isSameDay(date, checkIn) || isSameDay(date, checkOut);
      });
    },
    [bookedDates]
  );

  const isRangeMiddleDay = React.useCallback(
    (day: Date) => {
      if (!date?.from || !date?.to) return false;
      return isWithinInterval(day, {
        start: addDays(date.from, 1),
        end: addDays(date.to, -1),
      });
    },
    [date]
  );

  const disabledDays = React.useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today || isDateBooked(date);
    },
    [isDateBooked]
  );

  React.useEffect(() => {
    if (bookedDates?.length) {
      const firstBooking = bookedDates[0];
      console.log("First Booking CheckIn:", firstBooking.checkIn);
      console.log("Parsed CheckIn:", parseISO(firstBooking.checkIn));
    }
  }, [bookedDates]);

  return (
    <Calendar
      mode="range"
      selected={date}
      onSelect={setDate}
      disabled={disabledDays}
      numberOfMonths={1}
      defaultMonth={new Date()}
      modifiers={{
        range_middle: isRangeMiddleDay,
        booked: isDateBooked,
        booking_boundary: isBookingBoundary,
      }}
      modifiersStyles={{
        range_middle: {
          backgroundColor: "#E5E7EB",
          color: "#111827",
        },
        booked: {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          fontWeight: "500",
        },
        booking_boundary: {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          border: "2px solid #991B1B",
          fontWeight: "bold",
        },
      }}
      classNames={{
        day_selected: "bg-black text-white font-semibold",
        day_disabled: "bg-gray-300 text-gray-800",
        day_today: "bg-gray-400 text-black",
        day_outside: "text-gray-400",
      }}
    />
  );
};

export default BookingCalendar;
