"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { useSession } from "next-auth/react";
import LoginModal from "./LoginModal";
import ValidationCard from "./ValidationCard";
import api from "@/lib/axios";
import {
  BookedDate,
  BookingResponse,
  BookingSectionProps,
} from "@/types/Booking";
import BookingCalendar from "./BookingCalendar";

export default function BookingSection({ property }: BookingSectionProps) {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [validation, setValidation] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const bookingCountRef = useRef(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 500);
  };

  useEffect(() => {
    console.log("BookedDates state actually updated:", {
      length: bookedDates.length,
      data: bookedDates,
    });
    bookingCountRef.current = bookedDates.length;
  }, [bookedDates]);

  const fetchBookedDates = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching booked dates at:", new Date().toISOString());

      const response = await api.get<BookingResponse[]>(
        `/bookings/property/${property.id}`
      );

      console.log("Raw response from API:", response.data);

      const activeBookings = response.data
        .filter((booking) => booking.status !== "CANCELLED")
        .map((booking) => ({
          id: booking.id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
        }));

      console.log("Setting booked dates:", activeBookings);
      setBookedDates(activeBookings);
    } catch (error) {
      console.error("Error fetching dates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, [property.id, refreshKey]);

  const totalNights = React.useMemo(() => {
    if (date?.from && date?.to) {
      return differenceInDays(date.to, date.from);
    }
    return 0;
  }, [date?.from, date?.to]);

  const totalPrice = React.useMemo(() => {
    return totalNights * property.price;
  }, [totalNights, property.price]);

  const handleBookingRequest = async () => {
    if (!session || !date?.from || !date?.to) return;

    try {
      setIsLoading(true);
      const response = await api.post<BookingResponse>("/bookings", {
        propertyId: property.id,
        userId: session.user.id,
        checkIn: date.from.toISOString(),
        checkOut: date.to.toISOString(),
        totalPrice,
      });

      console.log("Booking response:", response.data);

      setRefreshKey((prev) => prev + 1);

      setValidation({
        type: "success",
        message: "Booking request submitted successfully!",
      });
      setDate(undefined);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectDatesClick = () => {
    if (!session) {
      setShowLoginModal(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="lg:col-span-1">
      {validation && (
        <ValidationCard type={validation.type} message={validation.message} />
      )}
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Book this property</CardTitle>
          <CardDescription>
            Select your dates to check availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {session ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-black hover:text-white duration-300 transition-all"
                    onClick={handleSelectDatesClick}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {date.from.toLocaleDateString()} -{" "}
                          {date.to.toLocaleDateString()}
                        </>
                      ) : (
                        date.from.toLocaleDateString()
                      )
                    ) : (
                      "Select Dates"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white p-4 rounded-md shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Select your stay dates</DialogTitle>
                    <DialogDescription>
                      Choose your check-in and check-out dates. Booked dates are
                      disabled.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <BookingCalendar
                      key={bookedDates.length}
                      property={property}
                      session={session}
                      date={date}
                      setDate={setDate}
                      bookedDates={bookedDates}
                    />
                  </div>
                  {/* Booking Summary */}
                  {date?.from && date?.to && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="font-normal">Price per night</span>
                        <span className="font-semibold">
                          ${property.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-normal">Total nights</span>
                        <span className="font-medium">{totalNights}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full hover:bg-black hover:text-white duration-300 transition-all"
                      onClick={handleDateConfirm}
                      disabled={!date?.from || !date?.to || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Confirm Dates"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="outline"
                className="w-full hover:bg-black hover:text-white duration-300 transition-all"
                onClick={() => setShowLoginModal(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Select Dates
              </Button>
            )}

            {/* Total nights and Total price */}
            <div className="flex justify-between">
              <span className="font-normal">Price per night</span>
              <span className="font-semibold">
                ${property.price.toLocaleString()}
              </span>
            </div>
            {date?.from && date?.to && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total nights</span>
                  <span className="font-medium">{totalNights}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Request to Book Button */}
            <Button
              className="w-full hover:bg-black hover:text-white duration-300 transition-all"
              variant="outline"
              size="lg"
              disabled={!date?.from || !date?.to}
              onClick={() => {
                if (!session) {
                  setShowLoginModal(true);
                } else {
                  handleBookingRequest();
                }
              }}
            >
              Request to Book
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
