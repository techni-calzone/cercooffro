'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaHome, 
  FaBed, 
  FaUniversity, 
  FaFilter,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

export type ListingType = 'agency' | 'person';

export interface FilterOptions {
  priceRange: [number, number];
  roomType: string[];
  amenities: string[];
  universityProximity: number;
  listingType?: ListingType[];
}

interface FilterDropdownProps {
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  initialFilters?: Partial<FilterOptions>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  onApplyFilters, 
  onClose, 
  initialFilters = {} 
}: FilterDropdownProps) => {
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: initialFilters.priceRange || [0, 2000],
    roomType: initialFilters.roomType || [],
    amenities: initialFilters.amenities || [],
    universityProximity: initialFilters.universityProximity || 5,
    listingType: initialFilters.listingType || [],
  });

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
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] md:w-[600px] lg:w-[800px] bg-white rounded-xl shadow-lg z-50"
    >
      <div className="p-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaFilter className="text-cercooffro-primary" />
          {t('filters.title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Listing Type */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FaHome className="text-cercooffro-primary" />
              {t('filters.listingType')}
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.listingType?.includes('agency')}
                  onChange={() => {
                    setFilters(prev => ({
                      ...prev,
                      listingType: prev.listingType?.includes('agency')
                        ? prev.listingType.filter(t => t !== 'agency')
                        : [...(prev.listingType || []), 'agency']
                    }));
                  }}
                  className="rounded text-cercooffro-primary focus:ring-cercooffro-primary"
                />
                <span className="flex items-center gap-2">
                  <FaBuilding className="text-gray-500" />
                  {t('filters.agency')}
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.listingType?.includes('person')}
                  onChange={() => {
                    setFilters(prev => ({
                      ...prev,
                      listingType: prev.listingType?.includes('person')
                        ? prev.listingType.filter(t => t !== 'person')
                        : [...(prev.listingType || []), 'person']
                    }));
                  }}
                  className="rounded text-cercooffro-primary focus:ring-cercooffro-primary"
                />
                <span className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  {t('filters.person')}
                </span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FaMoneyBillWave className="text-cercooffro-primary" />
              {t('filters.priceRange')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">{t('filters.min')}</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setFilters(prev => ({
                      ...prev,
                      priceRange: [value, prev.priceRange[1]]
                    }));
                  }}
                  className="w-full p-2 border rounded-lg"
                  placeholder={t('filters.minPrice')}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">{t('filters.max')}</label>
                <input
                  type="number"
                  min={filters.priceRange[0]}
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const value = Math.max(filters.priceRange[0], parseInt(e.target.value) || 0);
                    setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], value]
                    }));
                  }}
                  className="w-full p-2 border rounded-lg"
                  placeholder={t('filters.maxPrice')}
                />
              </div>
            </div>
          </div>

          {/* University Proximity */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FaUniversity className="text-cercooffro-primary" />
              {t('filters.universityProximity')}
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={filters.universityProximity}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    universityProximity: parseInt(e.target.value)
                  }));
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">
                {filters.universityProximity}km
              </span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              onApplyFilters(filters);
              onClose();
            }}
            className="bg-cercooffro-primary text-white px-6 py-2 rounded-lg hover:bg-cercooffro-primary/90 transition-colors"
          >
            {t('filters.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
