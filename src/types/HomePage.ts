export interface House {
  id: number;
  title: string;
  image: string;
  price: number;
  beds: number;
  baths: number;
  sqft: string;
  location: string;
}

export interface HouseCardProps {
  house: {
    id: number;
    title: string;
    image: string;
    price: number;
    beds: number;
    baths: number;
    sqft: string;
    location: string;
  };
}
