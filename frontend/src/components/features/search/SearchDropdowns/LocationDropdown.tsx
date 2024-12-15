'use client';

import { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

interface LocationDropdownProps {
  onSelect: (location: string) => void;
  onClose: () => void;
  selectedLocation?: string;
  className?: string;
}

const LocationDropdown = ({ 
  onSelect, 
  onClose, 
  selectedLocation = '',
  className = '' 
}: LocationDropdownProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample locations - replace with actual data
  const locations = [
    'Milano',
    'Roma',
    'Firenze',
    'Torino',
    'Bologna',
    'Venezia',
    'Napoli',
    'Pisa'
  ];

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="w-full p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('locationDropdown.location')}</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('locationDropdown.searchLocation')}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cercooffro-primary"
        />
      </div>
      <div className="max-h-[50vh] md:max-h-60 overflow-y-auto">
        {filteredLocations.map((location) => (
          <div
            key={location}
            className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => {
              onSelect(location);
              onClose();
            }}
          >
            <FaMapMarkerAlt className="text-cercooffro-primary flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        ))}
        {filteredLocations.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            {t('locationDropdown.noResults')}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDropdown;
