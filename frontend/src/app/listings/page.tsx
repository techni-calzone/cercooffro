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
        <div className="w-full max-w-4xl mx-auto mb-8 relative">
          <div className="flex flex-col md:flex-row items-stretch bg-white border border-gray-300 rounded-xl md:rounded-full shadow-sm">
            {/* Where */}
            <div 
              onClick={() => {
                setIsLocationDropdownOpen(true);
                setIsDatesDropdownOpen(false);
                setIsGuestsDropdownOpen(false);
                setIsFilterDropdownOpen(false);
              }}
              className="flex-1 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-300"
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-medium truncate">
                    {t('where')}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                    {location || t('searchCitiesUniversitiesOrRegions')}
                  </p>
                </div>
              </div>
            </div>

            {/* When */}
            <div 
              onClick={() => {
                setIsDatesDropdownOpen(true);
                setIsLocationDropdownOpen(false);
                setIsGuestsDropdownOpen(false);
                setIsFilterDropdownOpen(false);
              }}
              className="flex-1 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-300"
            >
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-medium truncate">
                    {t('when')}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                    {(dates?.startDate && dates?.endDate) 
                      ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}`
                      : t('addDates')}
                  </p>
                </div>
              </div>
            </div>

            {/* Who */}
            <div 
              onClick={() => {
                setIsGuestsDropdownOpen(true);
                setIsLocationDropdownOpen(false);
                setIsDatesDropdownOpen(false);
                setIsFilterDropdownOpen(false);
              }}
              className="flex-1 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-300"
            >
              <div className="flex items-center gap-2">
                <FaUsers className="text-cercooffro-primary w-4 h-4 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-medium truncate">
                    {t('who')}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                    {typeof guests === 'number' && guests > 0 
                      ? `${guests} ${t('students')}` 
                      : t('addGuests')}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter and Search Buttons */}
            <div className="flex items-center justify-between px-2 py-1 space-x-2 md:space-x-0">
              <button 
                onClick={() => {
                  setIsFilterDropdownOpen(true);
                  setIsLocationDropdownOpen(false);
                  setIsDatesDropdownOpen(false);
                  setIsGuestsDropdownOpen(false);
                }}
                className="p-2 text-gray-600 hover:text-cercooffro-primary hover:bg-gray-50 rounded-full transition-colors"
                aria-label={t('filters.title')}
              >
                <FaFilter className="w-4 h-4" />
              </button>
              <button 
                onClick={performSearch}
                className="px-4 py-2 gap-2 flex items-center rounded-full bg-cercooffro-primary text-white hover:bg-cercooffro-primary/90 transition-colors"
                aria-label={t('search')}
              >
                <FaSearch className="w-4 h-4" />
                <span className="text-xs md:text-sm">{t('search')}</span>
              </button>
            </div>
          </div>

          {/* Dropdowns */}
          {isLocationDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2">
              <LocationDropdown 
                onClose={() => setIsLocationDropdownOpen(false)}
                onSelect={handleLocationSelect}
              />
            </div>
          )}
          {isDatesDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2">
              <DatesDropdown 
                onClose={() => setIsDatesDropdownOpen(false)}
                onSelect={handleDatesSelect}
              />
            </div>
          )}
          {isGuestsDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2">
              <GuestsDropdown 
                onClose={() => setIsGuestsDropdownOpen(false)}
                // TODO: Implement guest selection
                onSelect={() => {}}
              />
            </div>
          )}
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2">
              <FilterDropdown 
                onClose={() => setIsFilterDropdownOpen(false)}
                // TODO: Implement filter selection
                onSelect={() => {}}
              />
            </div>
          )}
        </div>

        {/* Listings Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredListings.map((listing) => (
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
                  Listing {listing}
                </h2>
                <p className="text-gray-600 mb-4">
                  Spacious student apartment near university campus
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-cercooffro-secondary font-bold text-lg">
                    €500/month
                  </span>
                  <a 
                    href={`/listings/${listing}`} 
                    className="bg-cercooffro-primary text-white px-4 py-2 rounded-full 
                      hover:bg-opacity-90 transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
