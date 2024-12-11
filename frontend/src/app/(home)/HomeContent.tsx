'use client';

import { Listing } from '@/types/Listing';
import ListingCard from '@/components/ListingCard';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaSearch, FaHome, FaUserFriends } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Mock Listings Data
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Cozy Studio Near University',
    location: 'Milan',
    university: 'Politecnico di Milano',
    price: 600,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  },
  {
    id: '2',
    title: 'Modern Apartment in City Center',
    location: 'Rome',
    university: 'Sapienza University',
    price: 800,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  },
  {
    id: '3',
    title: 'Student Friendly Shared House',
    location: 'Florence',
    university: 'University of Florence',
    price: 450,
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
  },
  {
    id: '4',
    title: 'Quiet Room in Historical Building',
    location: 'Bologna',
    university: 'University of Bologna',
    price: 500,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858'
  }
];

export default function HomeContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>(mockListings);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/add-offer" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
                {t('home.hero.addOffer')}
              </Link>
              <Link href="/listings" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                {t('home.hero.browseListings')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl text-blue-500 mb-4 flex justify-center">
                <FaHome />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.feature1.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature1.description')}</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl text-blue-500 mb-4 flex justify-center">
                <FaUserFriends />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.feature2.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature2.description')}</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl text-blue-500 mb-4 flex justify-center">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.feature3.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature3.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.featuredListings.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/listings" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
              {t('home.featuredListings.viewAll')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
