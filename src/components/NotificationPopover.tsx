"use client";

import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function NotificationPopover() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<
    {
      id: number;
      message: string;
      type: string;
      bookingId?: string;
      isRead: boolean;
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

  // Fetch notifications from the API
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
              ? { ...notif, message: "Booking approved", isRead: true }
              : notif
          )
        );
      } else {
        console.error("Failed to approve booking");
      }
    } catch (error) {
      console.error("Error approving booking:", error);
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
              ? { ...notif, message: "Booking declined", isRead: true }
              : notif
          )
        );
      } else {
        console.error("Failed to decline booking");
      }
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    setVisibleNotifications((prev) => prev + 5); // Show 5 more notifications
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 border border-gray-200 shadow-lg bg-white">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Notifications
        </h3>

        {isLoading ? (
          <p className="text-gray-500 text-xs">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-xs">No new notifications</p>
        ) : (
          <>
            <ul className="space-y-2">
              {notifications.slice(0, visibleNotifications).map((notif) => (
                <li
                  key={notif.id}
                  className={`p-3 rounded-lg text-sm ${
                    notif.isRead ? "bg-gray-100" : "bg-gray-800 text-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <div className="flex flex-col gap-1">
                    <p>{notif.message}</p>
                    {notif.data && (
                      <div className="text-xs text-gray-500">
                        {notif.data.checkIn && (
                          <p>
                            Check-in:{" "}
                            {new Date(notif.data.checkIn).toLocaleDateString()}
                          </p>
                        )}
                        {notif.data.checkOut && (
                          <p>
                            Check-out:{" "}
                            {new Date(notif.data.checkOut).toLocaleDateString()}
                          </p>
                        )}
                        {notif.data.totalPrice && (
                          <p>Total: ${notif.data.totalPrice}</p>
                        )}
                        {notif.data.guestName && (
                          <p>Guest: {notif.data.guestName}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {notif.type === "booking_request_host" && !notif.isRead && (
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
                        className="bg-white text-gray-800 hover:bg-gray-800 hover:text-white"
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

        {notifications.length > 0 && (
          <button
            className="mt-3 w-full text-xs text-blue-600 hover:underline"
            onClick={() => router.push("/notifications")}
          >
            View all
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
