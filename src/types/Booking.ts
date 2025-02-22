import { Property } from "./HomePage";

export interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  propertyId: string;
  renterId: string;
  totalPrice: number;
}

export interface BookingResponse {
  id: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  propertyId: string;
  renterId: string;
  totalPrice?: number;
  property?: Property;
}

export interface BookingSectionProps {
  property: Property;
}

export interface BookedDate {
  id: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export type DateRange = {
  from?: Date;
  to?: Date;
};
