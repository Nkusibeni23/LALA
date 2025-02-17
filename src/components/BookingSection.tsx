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
import { addDays, isWithinInterval } from "date-fns";
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
          startDate: date.from.toISOString(),
          endDate: date.to.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();

      // Show success message
      toast.success("Booking request submitted successfully!");

      // Redirect to confirmation page or refresh the page
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
            {session ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-black hover:text-white duration-300 transition-all"
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
                          backgroundColor: "#f3f4f6",
                          color: "#000000",
                        },
                      }}
                      classNames={{
                        day_selected: "bg-black text-white",
                        day_disabled: "bg-gray-200 text-gray-400",
                        day_today: "bg-black text-black",
                        day_outside: "text-gray-400",
                      }}
                    />
                  </div>
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

            {/* Price Breakdown */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Price per month</span>
                <span className="font-bold">
                  ${property.price.toLocaleString()}
                </span>
              </div>
            </div>

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
