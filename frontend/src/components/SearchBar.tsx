import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import LocationDropdown from './SearchDropdowns/LocationDropdown';
import DatesDropdown from './SearchDropdowns/DatesDropdown';
import GuestsDropdown from './SearchDropdowns/GuestsDropdown';
import FilterDropdown from './SearchDropdowns/FilterDropdown';
import { useLanguage } from '../context/LanguageContext';

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
    <div className="w-full max-w-4xl mx-auto mb-8 relative flex flex-col md:flex-row items-center">
      <div className="flex flex-col md:flex-row flex-grow items-center bg-white border border-gray-300 rounded-full shadow-sm md:mr-2 pr-2 md:pr-4">
        {/* Where */}
        <div className="relative flex-1 md:flex-1/3 md:border-r border-gray-300 mb-2 md:mb-0">
          <div
            onClick={() => {
              setIsLocationDropdownOpen(true);
              setIsDatesDropdownOpen(false);
              setIsGuestsDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-full"
          >
            <FaMapMarkerAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{location ? location : t('searchBar.where')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{t('searchBar.searchCitiesUniversitiesOrRegions')}</p>
            </div>
          </div>
          {isLocationDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white rounded-md shadow-lg">
              <LocationDropdown
                onClose={() => setIsLocationDropdownOpen(false)}
                onSelect={(loc) => {
                  setLocation(loc);
                  onLocationSelect(loc);
                }}
              />
            </div>
          )}
        </div>

        {/* When */}
        <div className="relative flex-1 md:flex-1/3 md:border-r border-gray-300 mb-2 md:mb-0">
          <div
            onClick={() => {
              setIsDatesDropdownOpen(true);
              setIsLocationDropdownOpen(false);
              setIsGuestsDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-full"
          >
            <FaCalendarAlt className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{t('searchBar.when')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{dates.startDate && dates.endDate ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}` : t('searchBar.addDates')}</p>
            </div>
          </div>
          {isDatesDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white rounded-md shadow-lg">
              <DatesDropdown
                onClose={() => setIsDatesDropdownOpen(false)}
                onSelect={(dates) => {
                  setDates(dates);
                  onDatesSelect(dates);
                }}
              />
            </div>
          )}
        </div>

        {/* Who */}
        <div className="relative flex-1 md:flex-1/3 mb-2 md:mb-0">
          <div
            onClick={() => {
              setIsGuestsDropdownOpen(true);
              setIsLocationDropdownOpen(false);
              setIsDatesDropdownOpen(false);
              setIsFilterDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-full"
          >
            <FaUsers className="text-cercooffro-primary w-4 h-4 flex-shrink-0 mr-2" />
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{guests.students && guests.rooms ? `${guests.students} ${t('searchBar.students')} - ${guests.rooms} ${t('searchBar.rooms')}` : t('searchBar.who')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{t('searchBar.addGuests')}</p>
            </div>
          </div>
          {isGuestsDropdownOpen && (
            <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white rounded-md shadow-lg">
              <GuestsDropdown
                onClose={() => setIsGuestsDropdownOpen(false)}
                onSelect={(guests) => {
                  setGuests(guests);
                  onGuestsSelect(guests);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Wrap Filter and Search Buttons in a div */}
      <div className="relative flex items-center">
        {/* Filter Button */}
        <button
          onClick={() => {
            setIsFilterDropdownOpen(!isFilterDropdownOpen);
            setIsLocationDropdownOpen(false);
            setIsDatesDropdownOpen(false);
            setIsGuestsDropdownOpen(false);
          }}
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 w-12 h-12 rounded-full flex items-center justify-center mx-2 transition-colors"
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

        {/* Filter Dropdown */}
        {isFilterDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 z-50">
            <FilterDropdown
              onClose={() => setIsFilterDropdownOpen(false)}
              onApply={(filters) => {
                onFiltersApply(filters);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;