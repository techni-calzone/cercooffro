import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import LocationDropdown from '@/components/features/search/SearchDropdowns/LocationDropdown';
import DatesDropdown from '@/components/features/search/SearchDropdowns/DatesDropdown';
import GuestsDropdown from '@/components/features/search/SearchDropdowns/GuestsDropdown';
import FilterDropdown from '@/components/features/search/SearchDropdowns/FilterDropdown';
import { useLanguage } from '@/context/LanguageContext';

interface SearchBarProps {
  onLocationSelect: (location: string) => void;
  onDatesSelect: (dates: { startDate: Date; endDate: Date }) => void;
  onGuestsSelect: (guests: { students: number; rooms: number }) => void;
  onSearch: () => void;
  onFiltersApply: (filters: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onLocationSelect,
  onDatesSelect,
  onGuestsSelect,
  onSearch,
  onFiltersApply,
}) => {
  const { t } = useLanguage();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDatesDropdownOpen, setIsDatesDropdownOpen] = useState(false);
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [dates, setDates] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [guests, setGuests] = useState<{ students: number | null; rooms: number | null }>({ students: null, rooms: null });

  // Enable search if at least one option is selected
  const isSearchEnabled = location || (dates.startDate && dates.endDate) || (guests.students && guests.rooms);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 relative flex flex-col md:flex-row items-center gap-2">
      <div className="w-full md:w-auto flex flex-col md:flex-row flex-grow items-center bg-white border border-gray-300 rounded-lg md:rounded-full shadow-sm md:mr-2 pr-2 md:pr-4 divide-y md:divide-y-0 md:divide-x divide-gray-300">
        {/* Where */}
        <div className="relative w-full md:w-auto flex-1 md:flex-1/3">
          <div
            onClick={() => {
              setIsLocationDropdownOpen(true);
              setIsDatesDropdownOpen(false);
              setIsGuestsDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg md:first:rounded-l-full md:first:rounded-r-none md:last:rounded-r-full md:last:rounded-l-none"
          >
            <FaMapMarkerAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{location ? location : t('searchBar.where')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{t('searchBar.searchCitiesUniversitiesOrRegions')}</p>
            </div>
          </div>
        </div>

        {/* When */}
        <div className="relative w-full md:w-auto flex-1 md:flex-1/3">
          <div
            onClick={() => {
              setIsDatesDropdownOpen(true);
              setIsLocationDropdownOpen(false);
              setIsGuestsDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg md:first:rounded-l-full md:first:rounded-r-none md:last:rounded-r-full md:last:rounded-l-none"
          >
            <FaCalendarAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{t('searchBar.when')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{dates.startDate && dates.endDate ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}` : t('searchBar.addDates')}</p>
            </div>
          </div>
        </div>

        {/* Who */}
        <div className="relative w-full md:w-auto flex-1 md:flex-1/3">
          <div
            onClick={() => {
              setIsGuestsDropdownOpen(true);
              setIsLocationDropdownOpen(false);
              setIsDatesDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg md:first:rounded-l-full md:first:rounded-r-none md:last:rounded-r-full md:last:rounded-l-none"
          >
            <FaUsers className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{guests.students && guests.rooms ? `${guests.students} ${t('searchBar.students')} - ${guests.rooms} ${t('searchBar.rooms')}` : t('searchBar.who')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{t('searchBar.addGuests')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wrap Filter and Search Buttons in a div */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {/* Filter Button */}
        <button
          onClick={() => {
            setIsFilterDropdownOpen(!isFilterDropdownOpen);
            setIsLocationDropdownOpen(false);
            setIsDatesDropdownOpen(false);
            setIsGuestsDropdownOpen(false);
          }}
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          aria-label={t('searchBar.filters')}
        >
          <FaFilter className="w-4 h-4" />
        </button>

        {/* Search Button (Icon Only, Circular) */}
        <button
          onClick={onSearch}
          disabled={!isSearchEnabled}
          className={`
            ${isSearchEnabled ? 'bg-cercooffro-primary hover:bg-cercooffro-primary/90' : 'bg-gray-300'}
            text-white flex items-center justify-center w-12 h-12 rounded-full transition-colors
          `}
          aria-label={t('searchBar.search')}
        >
          <FaSearch className={`w-5 h-5 ${isSearchEnabled ? '' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* Dropdowns Container */}
      {(isLocationDropdownOpen || isDatesDropdownOpen || isGuestsDropdownOpen || isFilterDropdownOpen) && (
        <div className="fixed inset-x-0 top-24 mx-auto z-50 w-[calc(100%-2rem)] md:w-[480px] bg-white rounded-lg shadow-lg border border-gray-200">
          {isLocationDropdownOpen && (
            <LocationDropdown
              onClose={() => setIsLocationDropdownOpen(false)}
              onSelect={(loc) => {
                setLocation(loc);
                onLocationSelect(loc);
              }}
            />
          )}
          {isDatesDropdownOpen && (
            <DatesDropdown
              onClose={() => setIsDatesDropdownOpen(false)}
              onSelect={(dates) => {
                setDates(dates);
                onDatesSelect(dates);
              }}
            />
          )}
          {isGuestsDropdownOpen && (
            <GuestsDropdown
              onClose={() => setIsGuestsDropdownOpen(false)}
              onSelect={(guests) => {
                setGuests(guests);
                onGuestsSelect(guests);
              }}
            />
          )}
          {isFilterDropdownOpen && (
            <FilterDropdown
              onClose={() => setIsFilterDropdownOpen(false)}
              onApply={(filters) => {
                onFiltersApply(filters);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;