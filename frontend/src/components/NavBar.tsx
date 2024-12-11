'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaFilter,
  FaUsers,
  FaCalendarAlt,
  FaKey,
  FaTimes,
  FaBars,
  FaPlusCircle,
  FaUserFriends
} from 'react-icons/fa';

import { useLanguage } from '../context/LanguageContext';
import { useNavBar } from '../hooks/useNavBar';

// Dynamic imports for components
const LocationDropdown = React.lazy(() => import('./SearchDropdowns/LocationDropdown'));
const DatesDropdown = React.lazy(() => import('./SearchDropdowns/DatesDropdown'));
const GuestsDropdown = React.lazy(() => import('./SearchDropdowns/GuestsDropdown'));
const FilterDropdown = React.lazy(() => import('./SearchDropdowns/FilterDropdown'));
const SearchModal = React.lazy(() => import('./SearchModal'));

export const NavBranding = () => {
  const { t } = useLanguage();

  return (
    <div className="text-2xl font-bold text-cercooffro-primary flex items-center space-x-2">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center bg-cercooffro-primary rounded-full">
            <FaKey className="w-6 h-6 text-white" />
          </div>
          <span>CercoOffro</span>
        </div>
      </Link>
    </div>
  );
};

export const NavLinks = () => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link href="/about" className="text-gray-600 hover:text-cercooffro-primary">
        {t('navbar.about')}
      </Link>
      <Link href="/contact" className="text-gray-600 hover:text-cercooffro-primary">
        {t('navbar.contact')}
      </Link>
      <Link 
        href="/searchers" 
        className="flex items-center space-x-2 text-gray-600 hover:text-cercooffro-primary"
        aria-label={t('searchersPage.title')}
      >
        <FaUserFriends className="w-5 h-5" />
        <span>{t('navbar.searchers')}</span>
      </Link>
      <Link 
        href="/add-offer" 
        className="flex items-center space-x-2 text-white bg-cercooffro-primary hover:bg-opacity-90 px-4 py-2 rounded-full transition-colors"
        aria-label={t('navbar.addOfferDescription')}
      >
        <FaPlusCircle className="w-5 h-5" />
        <span>{t('navbar.addOffer')}</span>
      </Link>
    </div>
  );
};

export const LanguageToggle = ({ 
  language, 
  toggleLanguage 
}: { 
  language: string; 
  toggleLanguage: () => void; 
}) => {
  const { t, language: lang } = useLanguage();
  
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        toggleLanguage();
      }}
      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors flex items-center space-x-1"
      aria-label={t('navbar.toggleLanguage')}
    >
      <span>{lang === 'en' ? '🇮🇹' : '🇬🇧'}</span>
      <span>{lang === 'en' ? 'IT' : 'EN'}</span>
    </button>
  );
};

export const SearchBar = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { 
    isLocationDropdownOpen,
    isDatesDropdownOpen,
    isGuestsDropdownOpen,
    isFilterDropdownOpen,
    isSearchModalOpen,
    location,
    dates = { startDate: null, endDate: null },
    guests,
    toggleLocationDropdown,
    toggleDatesDropdown,
    toggleGuestsDropdown,
    toggleFilterDropdown,
    toggleSearchModal,
    handleLocationSelect,
    handleDatesSelect
  } = useNavBar();

  const performSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (location) searchParams.set('location', location);
    if (dates.startDate) searchParams.set('startDate', dates.startDate.toISOString());
    if (dates.endDate) searchParams.set('endDate', dates.endDate.toISOString());
    if (typeof guests === 'number' && guests > 0) searchParams.set('students', guests.toString());

    router.push(`/listings?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="flex flex-col md:flex-row items-stretch bg-white border border-gray-300 rounded-xl md:rounded-full shadow-sm">
        {/* Sections Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Where */}
          <div 
            onClick={() => toggleLocationDropdown()}
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-300 flex items-center gap-3"
          >
            <FaMapMarkerAlt className="text-cercooffro-primary w-5 h-5 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-medium truncate">{t('where')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                {location || t('searchCitiesUniversitiesOrRegions')}
              </p>
            </div>
          </div>

          {/* When */}
          <div 
            onClick={() => toggleDatesDropdown()}
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-300 flex items-center gap-3"
          >
            <FaCalendarAlt className="text-cercooffro-primary w-5 h-5 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-medium truncate">{t('when')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                {(dates.startDate && dates.endDate) 
                  ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}`
                  : t('addDates')}
              </p>
            </div>
          </div>

          {/* Who */}
          <div 
            onClick={() => toggleGuestsDropdown()}
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors md:border-r border-gray-300 flex items-center gap-3"
          >
            <FaUsers className="text-cercooffro-primary w-5 h-5 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-medium truncate">{t('who')}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                {typeof guests === 'number' && guests > 0 
                  ? `${guests} ${t('students')}` 
                  : t('addGuests')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-2 md:p-1 space-x-2">
          <button 
            onClick={() => toggleFilterDropdown()}
            className="p-2 text-gray-600 hover:text-cercooffro-primary hover:bg-gray-50 rounded-full transition-colors"
            aria-label={t('filters.title')}
          >
            <FaFilter className="w-4 h-4" />
          </button>
          <button 
            onClick={performSearch}
            className="px-4 py-2 bg-cercooffro-primary text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center space-x-1"
            aria-label={t('search')}
          >
            <FaSearch className="w-4 h-4" />
            <span className="text-xs md:text-sm">{t('search')}</span>
          </button>
        </div>
      </div>

      {/* Dropdowns */}
      {isLocationDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <LocationDropdown 
            onClose={() => toggleLocationDropdown(false)} 
            onSelect={handleLocationSelect}
          />
        </Suspense>
      )}
      {isDatesDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <DatesDropdown 
            onClose={() => toggleDatesDropdown(false)} 
            onSelect={handleDatesSelect}
          />
        </Suspense>
      )}
      {isGuestsDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <GuestsDropdown onClose={() => toggleGuestsDropdown(false)} />
        </Suspense>
      )}

      {isFilterDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <FilterDropdown 
            onClose={() => toggleFilterDropdown(false)}
            onApplyFilters={(filters) => {
              console.log('Applied filters:', filters);
              toggleFilterDropdown(false);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export const NavBar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { 
    isSearchModalOpen,
    toggleSearchModal,
  } = useNavBar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaKey className="h-8 w-8 text-cercooffro-primary" />
            <span className="text-xl font-bold text-cercooffro-primary">CercoOffro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <LanguageToggle language={language} toggleLanguage={toggleLanguage} />
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => toggleSearchModal(true)}
              className="text-gray-700 hover:text-cercooffro-primary"
              aria-label={t('navbar.toggleSearch')}
            >
              <FaSearch className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-cercooffro-primary"
              aria-label={t('navbar.toggleMenu')}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Row - Hidden on Mobile */}
        <div className="hidden md:flex py-4 justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLinks />
            <div className="px-3 py-2">
              <LanguageToggle 
                language={language} 
                toggleLanguage={toggleLanguage} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <SearchModal 
            isOpen={isSearchModalOpen} 
            onClose={() => toggleSearchModal(false)}
            onSearch={(searchParams) => {
              console.log('Search params:', searchParams);
              toggleSearchModal(false);
            }}
          />
        </Suspense>
      )}
    </nav>
  );
};
