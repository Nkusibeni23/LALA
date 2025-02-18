export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

export interface Amenity {
  id: string;
  name: string;
  icon: React.ElementType;
}

export interface HostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "update";
  propertyId?: string;
  initialData?: PropertiesData;
}

export interface PropertiesData {
  category: string;
  title: string;
  description: string;
  location: string;
  price: string;
  rooms: string;
  bathrooms: string;
  amenities: string[];
  images: string[];
}

export interface UploadResponse {
  urls: string[];
}
