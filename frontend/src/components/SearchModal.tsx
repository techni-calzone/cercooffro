'use client';

import React, { useState, Suspense } from 'react';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import LocationDropdown from './SearchDropdowns/LocationDropdown';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchParams: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const { t } = useLanguage();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [guests, setGuests] = useState(1);

  if (!isOpen) return null;

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLocationDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl transform transition-all mt-16">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            aria-label={t('close')}
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Where */}
            <div className="mb-8 relative">
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-cercooffro-primary" />
                <h3 className="text-lg font-medium">{t('where')}</h3>
              </div>
              <div 
                onClick={() => setIsLocationDropdownOpen(true)}
                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-cercooffro-primary transition-colors"
              >
                <p className="text-gray-700">
                  {location || t('searchCitiesUniversitiesOrRegions')}
                </p>
              </div>
              {isLocationDropdownOpen && (
                <div className="absolute w-full z-10 mt-2">
                  <Suspense fallback={<div className="p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
                    <LocationDropdown 
                      onSelect={handleLocationSelect}
                      onClose={() => setIsLocationDropdownOpen(false)}
                      selectedLocation={location}
                    />
                  </Suspense>
                </div>
              )}
            </div>

            {/* When */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-cercooffro-primary" />
                <h3 className="text-lg font-medium">{t('when')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercooffro-primary focus:border-transparent"
                  placeholder={t('checkIn')}
                  onChange={(e) => setDates({ ...dates, startDate: new Date(e.target.value) })}
                />
                <input
                  type="date"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercooffro-primary focus:border-transparent"
                  placeholder={t('checkOut')}
                  onChange={(e) => setDates({ ...dates, endDate: new Date(e.target.value) })}
                />
              </div>
            </div>

            {/* Who */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FaUsers className="text-cercooffro-primary" />
                <h3 className="text-lg font-medium">{t('who')}</h3>
              </div>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercooffro-primary focus:border-transparent"
                placeholder={t('guestsHint')}
              />
            </div>

            {/* Search button */}
            <button
              onClick={() => {
                onSearch({ location, dates, guests });
                onClose();
              }}
              className="w-full bg-cercooffro-primary text-white py-3 rounded-lg hover:bg-cercooffro-primary/90 transition-colors"
            >
              {t('search')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
