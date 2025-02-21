import { Property } from "./HomePage";

export interface BookingResponse {
  id: string;
}

export interface BookingSectionProps {
  property: Property;
}

export interface BookedDate {
  checkIn: Date;
  checkOut: Date;
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  propertyId: string;
  renterId: string;
  totalPrice: number;
}
