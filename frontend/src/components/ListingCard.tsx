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
    <div className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Image Carousel */}
      <div className="aspect-[4/3] relative rounded-t-xl overflow-hidden">
        <Image 
          src={listing.images && listing.images.length > 0 ? listing.images[0] : '/images/placeholder.jpg'} 
          alt={listing.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Buttons */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          {/* Listing Type Badge */}
          {listing.listingType && ListingTypeIcon && (
            <div className="bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
              <ListingTypeIcon className="text-xs text-cercooffro-primary" />
              <span className="text-xs font-medium">
                {t(`filters.${listing.listingType}`)}
              </span>
            </div>
          )}

          {/* Favorite/Save Button */}
          <button className="ml-auto bg-white/70 p-2 rounded-full hover:bg-white transition-all">
            <FaHeart className="text-sm text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Listing Details */}
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-grow overflow-hidden">
            <h3 className="font-bold text-base truncate max-w-[200px] md:max-w-none">{listing.title}</h3>
            <p className="text-xs text-gray-600 truncate max-w-[200px] md:max-w-none">{listing.location}</p>
            {listing.university && (
              <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-none">{listing.university}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <FaStar className="text-xs text-cercooffro-primary" />
            <span className="text-xs font-semibold">{listing.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-base">
            €{listing.price.toLocaleString()}<span className="text-xs font-normal text-gray-500">/month</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
