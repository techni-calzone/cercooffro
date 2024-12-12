'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaFilter, 
  FaSearch 
} from 'react-icons/fa';

import { useLanguage } from '@/context/LanguageContext';
import { useNavBar } from '@/hooks/useNavBar';

import SimpleNavbar from '@/components/layout/SimpleNavbar';
import LocationDropdown from '@/components/features/search/SearchDropdowns/LocationDropdown';
import DatesDropdown from '@/components/features/search/SearchDropdowns/DatesDropdown';
import GuestsDropdown from '@/components/features/search/SearchDropdowns/GuestsDropdown';
import FilterDropdown from '@/components/features/search/SearchDropdowns/FilterDropdown';
import SearchBar from '@/components/features/search/SearchBar';

interface ListingType {
  id: number;
  title: string;
  description: string;
  // Add other relevant fields here
}

export default function ListingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredListings, setFilteredListings] = useState<ListingType[]>([
    { id: 1, title: 'Listing 1', description: 'Description 1' },
    { id: 2, title: 'Listing 2', description: 'Description 2' },
    { id: 3, title: 'Listing 3', description: 'Description 3' },
    { id: 4, title: 'Listing 4', description: 'Description 4' },
    { id: 5, title: 'Listing 5', description: 'Description 5' },
    { id: 6, title: 'Listing 6', description: 'Description 6' },
  ]);

  const { 
    location,
    dates,
    guests,
    isLocationDropdownOpen,
    isDatesDropdownOpen,
    isGuestsDropdownOpen,
    isFilterDropdownOpen,
    setIsLocationDropdownOpen,
    setIsDatesDropdownOpen,
    setIsGuestsDropdownOpen,
    setIsFilterDropdownOpen,
    handleLocationSelect,
    handleDatesSelect,
    handleSearch
  } = useNavBar();

  // Initialize state from URL search params on page load
  useEffect(() => {
    const locationParam = searchParams ? searchParams.get('location') : null;
    const startDateParam = searchParams ? searchParams.get('startDate') : null;
    const endDateParam = searchParams ? searchParams.get('endDate') : null;
    const studentsParam = searchParams ? searchParams.get('students') : null;

    if (locationParam) handleLocationSelect(locationParam);
    if (startDateParam && endDateParam) {
      handleDatesSelect({
        startDate: new Date(startDateParam),
        endDate: new Date(endDateParam)
      });
    }
    // TODO: Implement guest selection from params
  }, [searchParams]);

  const performSearch = () => {
    const params = new URLSearchParams();
    
    if (location) params.set('location', location);
    if (dates?.startDate) params.set('startDate', dates.startDate.toISOString());
    if (dates?.endDate) params.set('endDate', dates.endDate.toISOString());
    if (typeof guests.students === 'number' && guests.students > 0) params.set('students', guests.students.toString());

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <>
      <SimpleNavbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6">{t('listings.title')}</h1>
        <p className="text-gray-600 mb-4">{t('listings.subtitle')}</p>
        <SearchBar 
          onLocationSelect={handleLocationSelect}
          onDatesSelect={handleDatesSelect}
          onGuestsSelect={() => {}}
          onFiltersApply={() => {}}
          onSearch={performSearch}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden 
                  hover:shadow-lg transition-shadow duration-300 
                  transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Listing Image</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-cercooffro-primary">
                    {listing.title}
                  </h2>
                  <p className="text-gray-600">
                    {listing.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">{t('listings.noListings')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
