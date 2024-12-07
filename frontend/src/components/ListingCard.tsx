import React from 'react';
import Image from 'next/image';
import { FaHeart, FaStar, FaUser, FaBuilding } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { ListingType } from './SearchDropdowns/FilterDropdown';

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
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { t } = useLanguage();

  const ListingTypeIcon = listing.listingType === 'agency' ? FaBuilding : listing.listingType === 'person' ? FaUser : null;

  return (
    <div className="relative group">
      {/* Listing Type Badge */}
      {listing.listingType && ListingTypeIcon && (
        <div className="absolute top-3 left-3 z-10 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2">
          <ListingTypeIcon className="text-cercooffro-primary" />
          <span className="text-sm font-medium">
            {t(`filters.${listing.listingType}`)}
          </span>
        </div>
      )}

      {/* Favorite/Save Button */}
      <button className="absolute top-3 right-3 z-10 bg-white/70 p-2 rounded-full hover:bg-white transition-all">
        <FaHeart className="text-gray-500 group-hover:text-red-500 transition-colors" />
      </button>

      {/* Image Carousel */}
      <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
        <Image 
          src={listing.images[0]} 
          alt={listing.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Listing Details */}
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{listing.title}</h3>
          <p className="text-gray-600">{listing.location}</p>
          {listing.university && (
            <p className="text-gray-500 text-sm">{listing.university}</p>
          )}
          <p className="font-semibold text-lg mt-1">
            €{listing.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/month</span>
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <FaStar className="text-cercooffro-primary" />
          <span className="font-semibold">{listing.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
