export type ListingType = 'apartment' | 'house' | 'room' | 'studio' | 'agency' | 'person';

export type ListingOwnerType = 'agency' | 'person';

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  university?: string;
  amenities: string[];
  listingType?: ListingType;
  ownerType?: ListingOwnerType;
  availability?: string;
  type?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  features?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}
