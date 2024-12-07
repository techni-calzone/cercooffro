'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ListingCard, { Listing } from '../components/ListingCard';
import ListingDetailsModal from '../components/ListingDetailsModal';
import CommunityBanner from '../components/CommunityBanner';
import { NavBar } from '../components/NavBar';
import { useLanguage } from '../context/LanguageContext';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa';

// Mock Listings Data
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Studio near Politecnico',
    location: 'Milan',
    university: 'Politecnico di Milano',
    price: 800,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1484101403633-471b3429f2d4',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
    ],
    amenities: ['WiFi', 'Kitchen', 'Balcony']
  },
  {
    id: '2',
    title: 'Cozy Apartment in Trastevere',
    location: 'Rome',
    university: 'Sapienza University',
    price: 950,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1502672023488-70df022f078e',
      'https://images.unsplash.com/photo-1560448204-e02f5fe2065a',
      'https://images.unsplash.com/photo-1556020685-ae9791a22dcb'
    ],
    amenities: ['AC', 'Gym', 'Study Area']
  },
  {
    id: '3',
    title: 'Spacious Loft near University',
    location: 'Florence',
    university: 'University of Florence',
    price: 750,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1484101403633-471b3429f2d4',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
    ],
    amenities: ['Parking', 'Kitchen', 'Laundry']
  },
  {
    id: '4',
    title: 'Elegant Room in Historic Center',
    location: 'Bologna',
    university: 'University of Bologna',
    price: 700,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1556020685-ae9791a22dcb',
      'https://images.unsplash.com/photo-1560448204-e02f5fe2065a',
      'https://images.unsplash.com/photo-1502672023488-70df022f078e'
    ],
    amenities: ['WiFi', 'Shared Lounge', 'Bike Rental']
  }
];

export default function Home({ initialListingId }: { initialListingId?: string } = {}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Check URL for listing ID on component mount
  useEffect(() => {
    const listingId = initialListingId || window.location.pathname.split('/').pop();
    if (listingId && listingId !== '') {
      const listing = mockListings.find(l => l.id === listingId);
      if (listing) {
        setSelectedListing(listing);
      }
    }
  }, [initialListingId]);

  const handleListingClick = (listing: Listing) => {
    // Update URL with listing ID
    router.push(`/${listing.id}`);
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    // Remove listing ID from URL
    router.push('/');
    setSelectedListing(null);
  };

  return (
    <main className="min-h-screen bg-cercooffro-background">
      {/* Listings Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cercooffro-text mb-4">
            {t('availableListings')}
          </h1>
          <p className="text-xl text-cercooffro-muted">
            {t('findYourPerfectStudentHome')}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockListings.map((listing) => (
            <div 
              key={listing.id} 
              onClick={() => handleListingClick(listing)} 
              className="cursor-pointer"
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>

      {/* Listing Details Modal */}
      {selectedListing && (
        <ListingDetailsModal 
          listing={selectedListing} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Community Banner */}
      <CommunityBanner />
    </main>
  );
}