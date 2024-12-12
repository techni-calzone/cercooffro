import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaStar, FaUser, FaBuilding } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    createdAt: string;
    status?: 'active' | 'inactive' | 'pending';
    ownerType?: 'agency' | 'person';
    university?: string;
    rating?: number;
  };
  isOwner?: boolean;
  onStatusChange?: (listingId: string, newStatus: 'active' | 'inactive') => void;
  onDelete?: (listingId: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isOwner = false,
  onStatusChange,
  onDelete,
}) => {
  const { t } = useLanguage();
  const ListingTypeIcon = listing.ownerType === 'agency' ? FaBuilding : listing.ownerType === 'person' ? FaUser : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48">
        <Image
          src={listing.images[0] || '/placeholder-image.jpg'}
          alt={listing.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <FaHeart className="h-5 w-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-cercooffro-primary">
            €{listing.price}/month
          </p>
          <p className="text-sm text-gray-500">{listing.location}</p>
        </div>
        
        {isOwner && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <select
                value={listing.status}
                onChange={(e) => onStatusChange?.(listing.id, e.target.value as 'active' | 'inactive')}
                className="block w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-cercooffro-primary focus:border-cercooffro-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={() => onDelete?.(listing.id)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
            </div>
            <Link
              href={`/listings/edit/${listing.id}`}
              className="block w-full text-center px-4 py-2 border border-cercooffro-primary text-cercooffro-primary rounded-md hover:bg-cercooffro-primary hover:text-white transition-colors"
            >
              Edit Listing
            </Link>
          </div>
        )}

        <div className="flex justify-between items-start mt-4">
          <div className="flex-grow overflow-hidden">
            {listing.university && (
              <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-none">
                {listing.university}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <FaStar className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-semibold">
              {listing.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;