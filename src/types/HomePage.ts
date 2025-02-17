export interface House {
  id: number;
  title: string;
  images: string[];
  price: number;
  beds: number;
  bathrooms: number;
  rooms: number;
  description: string;
  amenities: string[];
  hostId: number;
  hostName: string;
  category: string;
  location: string;
}

export interface HouseCardProps {
  house: {
    id: number;
    title: string;
    images: string[];
    price: number;
    beds: number;
    bathrooms: number;
    rooms: number;
    description: string;
    amenities: string[];
    hostId: number;
    hostName: string;
    category: string;
    location: string;
  };
}

export enum Role {
  RENTER = "RENTER",
  HOST = "HOST",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  emailVerified?: Date;
  image?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  userId: string;
  user: User;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

export type Property = House;
