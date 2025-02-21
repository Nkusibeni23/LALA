"use client";

import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "./SpinnerLoader";
import { motion, AnimatePresence } from "framer-motion";
import { iconMap } from "@/types/Validation";

const colors = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
};

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState<
    {
      id: number;
      message: string;
      type: string;
      bookingId?: string;
      isRead: boolean;
      createdAt: string;
      actionTaken?: boolean;
      data?: {
        checkIn?: string;
        checkOut?: string;
        totalPrice?: number;
        guestName?: string;
      };
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleNotifications, setVisibleNotifications] = useState(5);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [validation, setValidation] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notification", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const showValidation = (type: "success" | "error", message: string) => {
    setValidation({ show: true, type, message });
    setTimeout(() => setValidation(null), 3000);
  };

  const handleApprove = async (bookingId: string, notificationId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.bookingId === bookingId
              ? { ...notif, message: "Booking approved", actionTaken: true }
              : notif
          )
        );
        showValidation("success", "Booking successfully approved!");
      } else {
        showValidation("error", "Failed to approve booking. Please try again.");
      }
    } catch (error) {
      showValidation("error", "Error approving booking. Please try again.");
    }
  };

  const handleDecline = async (bookingId: string, notificationId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELED" }),
      });

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.bookingId === bookingId
              ? { ...notif, message: "Booking declined", actionTaken: true }
              : notif
          )
        );
        showValidation("success", "Booking successfully declined!");
      } else {
        showValidation("error", "Failed to decline booking. Please try again.");
      }
    } catch (error) {
      showValidation("error", "Error declining booking. Please try again.");
    }
  };

  const handleLoadMore = () => {
    setVisibleNotifications((prev) => prev + 5);
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handlePopoverOpen = () => {
    setIsPopoverOpen(true);
  };

  return (
    <>
      <Popover
        onOpenChange={(open) => {
          if (open) {
            handlePopoverOpen();
          }
          setIsPopoverOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <button className="relative p-2 rounded-full hover:bg-gray-300 transition">
            <Bell className="w-6 h-6 text-gray-700" />
            {notifications.filter(
              (notif) => !notif.isRead && !notif.actionTaken
            ).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.filter(
                  (notif) => !notif.isRead && !notif.actionTaken
                ).length > 9
                  ? "9+"
                  : notifications.filter(
                      (notif) => !notif.isRead && !notif.actionTaken
                    ).length}
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 border border-gray-200 shadow-lg bg-white">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Notifications
          </h3>

          {isLoading ? (
            <SpinnerLoader />
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center font-semibold">
              No new notifications
            </p>
          ) : (
            <>
              <ul className="max-h-72 overflow-y-auto space-y-2 cursor-pointer">
                {notifications.slice(0, visibleNotifications).map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-3 rounded-lg text-sm ${
                      notif.isRead ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 transition-colors`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold">{notif.message}</p>
                      {notif.data && (
                        <div className="text-xs text-gray-500">
                          {notif.data.checkIn && (
                            <p>
                              Check-in:{" "}
                              {new Date(
                                notif.data.checkIn
                              ).toLocaleDateString()}
                            </p>
                          )}
                          {notif.data.checkOut && (
                            <p>
                              Check-out:{" "}
                              {new Date(
                                notif.data.checkOut
                              ).toLocaleDateString()}
                            </p>
                          )}
                          {notif.data.totalPrice && (
                            <p>
                              Total: ${notif.data.totalPrice.toLocaleString()}
                            </p>
                          )}
                          {notif.data.guestName && (
                            <p>Guest: {notif.data.guestName}</p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {notif.type === "booking_request_host" &&
                      !notif.actionTaken && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-gray-800 hover:bg-gray-800 hover:text-white"
                            onClick={() =>
                              handleApprove(notif.bookingId!, notif.id)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-gray-800 hover:bg-red-600 hover:text-white"
                            onClick={() =>
                              handleDecline(notif.bookingId!, notif.id)
                            }
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                  </li>
                ))}
              </ul>

              {notifications.length > visibleNotifications && (
                <button
                  className="mt-3 w-full text-xs text-blue-600 hover:underline"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>

      <AnimatePresence>
        {validation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 p-4 rounded-lg border z-50 ${
              colors[validation.type]
            } shadow-lg z-50`}
          >
            <div className="flex items-center gap-2">
              {iconMap[validation.type]}
              <p>{validation.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
