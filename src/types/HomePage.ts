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
