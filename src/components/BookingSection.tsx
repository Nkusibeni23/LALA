"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { addDays, isWithinInterval, differenceInDays } from "date-fns";
import { useSession } from "next-auth/react";
import LoginModal from "./LoginModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BookingSectionProps {
  property: any;
}

export default function BookingSection({ property }: BookingSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const totalNights =
    date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = totalNights * property.price;

  const handleDateConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 500);
  };

  const handleBookingRequest = async () => {
    if (!session || !date?.from || !date?.to) {
      toast.error("Please select valid dates and ensure you are logged in.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          userId: session.user.id,
          checkIn: date.from.toISOString(),
          checkOut: date.to.toISOString(),
          totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();

      toast.success("Booking request submitted successfully!");

      router.push(`/bookings/${data.bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to submit booking request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isRangeMiddleDay = (day: Date) => {
    if (!date?.from || !date?.to) return false;
    return isWithinInterval(day, {
      start: addDays(date.from, 1),
      end: addDays(date.to, -1),
    });
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
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Book this property</CardTitle>
          <CardDescription>
            Select your dates to check availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Select Dates Button */}
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
                      Choose your check-in and check-out dates
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={new Date()}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      modifiers={{
                        range_middle: isRangeMiddleDay,
                      }}
                      modifiersStyles={{
                        range_middle: {
                          backgroundColor: "#BFBFBF",
                          color: "#000000",
                        },
                      }}
                      classNames={{
                        day_selected: "bg-black text-white font-semibold",
                        day_disabled: "bg-gray-300 text-gray-800",
                        day_today: "bg-gray-400 text-black",
                        day_outside: "text-gray-400",
                      }}
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
