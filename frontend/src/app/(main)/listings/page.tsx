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

import SimpleNavbar from '@/components/SimpleNavbar';
import LocationDropdown from '@/components/SearchDropdowns/LocationDropdown';
import DatesDropdown from '@/components/SearchDropdowns/DatesDropdown';
import GuestsDropdown from '@/components/SearchDropdowns/GuestsDropdown';
import FilterDropdown from '@/components/SearchDropdowns/FilterDropdown';
import SearchBar from '@/components/SearchBar';

export default function ListingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredListings, setFilteredListings] = useState([1, 2, 3, 4, 5, 6]);

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
    const locationParam = searchParams.get('location');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const studentsParam = searchParams.get('students');

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
    if (typeof guests === 'number' && guests > 0) params.set('students', guests.toString());

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
          onFilterSelect={() => {}}
          onSearch={performSearch}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <div 
                key={listing} 
                className="bg-white rounded-lg shadow-md overflow-hidden 
                  hover:shadow-lg transition-shadow duration-300 
                  transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Listing Image</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-cercooffro-primary">
                    {t('listings.listingTitle', { listing })}
                  </h2>
                  <p className="text-gray-600">
                    {t('listings.listingDescription')}
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
