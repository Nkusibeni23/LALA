export interface Notification {
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
  createdAt: string;
}
