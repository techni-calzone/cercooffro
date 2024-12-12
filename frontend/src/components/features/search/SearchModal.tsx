'use client';

import React, { useState, Suspense } from 'react';
import { 
  FaTimes, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers 
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { useNavBar } from '@/hooks/useNavBar';
import LocationDropdown from './SearchDropdowns/LocationDropdown';
import DatesDropdown from './SearchDropdowns/DatesDropdown';
import GuestsDropdown from './SearchDropdowns/GuestsDropdown';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const { t } = useLanguage();
  const { 
    handleLocationSelect, 
    handleDatesSelect,
    isLocationDropdownOpen, 
    setIsLocationDropdownOpen,
    isDatesDropdownOpen,
    setIsDatesDropdownOpen,
    isGuestsDropdownOpen,
    setIsGuestsDropdownOpen,
    location,
    dates,
    guests
  } = useNavBar();

  if (!isOpen) return null;

  const handleLocationSelectWrapper = (selectedLocation: string) => {
    handleLocationSelect(selectedLocation);
    setIsLocationDropdownOpen(false);
  };

  const handleDatesSelectWrapper = (selectedDates: { startDate: Date; endDate: Date }) => {
    handleDatesSelect(selectedDates);
    setIsDatesDropdownOpen(false);
  };

  const handleGuestsSelectWrapper = (selectedGuests: { students: number; rooms: number }) => {
    // Implement guest selection logic
    setIsGuestsDropdownOpen(false);
  };

  const performSearch = () => {
    onSearch({ location, dates, guests });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Search Inputs */}
        <div className="space-y-4">
          {/* Location */}
          <div 
            onClick={() => setIsLocationDropdownOpen(true)}
            className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg cursor-pointer"
          >
            <FaMapMarkerAlt className="text-cercooffro-primary" />
            <span>
              {location || t('where')}
            </span>
          </div>

          {/* Dates */}
          <div 
            onClick={() => setIsDatesDropdownOpen(true)}
            className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg cursor-pointer"
          >
            <FaCalendarAlt className="text-cercooffro-primary" />
            <span>
              {(dates?.startDate && dates?.endDate) 
                ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}` 
                : t('when')}
            </span>
          </div>

          {/* Guests */}
          <div 
            onClick={() => setIsGuestsDropdownOpen(true)}
            className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg cursor-pointer"
          >
            <FaUsers className="text-cercooffro-primary" />
            <span>
              {typeof guests === 'number' && guests > 0 
                ? `${guests} ${t('students')}` 
                : t('who')}
            </span>
          </div>

          {/* Search Button */}
          <button 
            onClick={performSearch}
            className="w-full bg-cercooffro-primary text-white py-3 rounded-full hover:bg-opacity-90 transition-colors"
          >
            {t('search')}
          </button>
        </div>

        {/* Dropdowns */}
        {isLocationDropdownOpen && (
          <LocationDropdown 
            onClose={() => setIsLocationDropdownOpen(false)}
            onSelect={handleLocationSelectWrapper}
          />
        )}
        {isDatesDropdownOpen && (
          <DatesDropdown 
            onClose={() => setIsDatesDropdownOpen(false)}
            onSelect={handleDatesSelectWrapper}
          />
        )}
        {isGuestsDropdownOpen && (
          <GuestsDropdown 
            onClose={() => setIsGuestsDropdownOpen(false)}
            onSelect={handleGuestsSelectWrapper}
          />
        )}
      </div>
    </div>
  );
};

export default SearchModal;
