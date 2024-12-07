'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaFilter,
  FaUsers,
  FaCalendarAlt,
  FaKey,
  FaTimes,
  FaBars
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
        {t('about')}
      </Link>
      <Link href="/contact" className="text-gray-600 hover:text-cercooffro-primary">
        {t('contact')}
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
  const { t } = useLanguage();
  
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        toggleLanguage();
      }}
      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
      aria-label={t('navbar.toggleLanguage')}
    >
      {language.toUpperCase() === 'EN' ? 'IT' : 'EN'}
    </button>
  );
};

export const SearchBar = () => {
  const { t } = useLanguage();
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
    toggleSearchModal
  } = useNavBar();

  return (
    <div className="w-full max-w-2xl relative">
      <div className="flex items-stretch bg-white border border-gray-300 rounded-full shadow-sm">
        {/* Where */}
        <div 
          onClick={() => toggleLocationDropdown()}
          className="flex-1 px-6 py-2 cursor-pointer hover:bg-gray-50 rounded-l-full transition-colors border-r border-gray-300"
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-cercooffro-primary" />
            <div>
              <p className="text-sm font-medium">{t('where')}</p>
              <p className="text-sm text-gray-500 truncate">
                {location || t('searchCitiesUniversitiesOrRegions')}
              </p>
            </div>
          </div>
        </div>

        {/* When */}
        <div 
          onClick={() => toggleDatesDropdown()}
          className="flex-1 px-6 py-2 cursor-pointer hover:bg-gray-50 transition-colors border-r border-gray-300"
        >
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-cercooffro-primary" />
            <div>
              <p className="text-sm font-medium">{t('when')}</p>
              <p className="text-sm text-gray-500 truncate">
                {(dates.startDate && dates.endDate) 
                  ? `${dates.startDate.toLocaleDateString()} - ${dates.endDate.toLocaleDateString()}`
                  : t('addDates')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Who */}
        <div 
          onClick={() => toggleGuestsDropdown()}
          className="flex-1 px-6 py-2 cursor-pointer hover:bg-gray-50 transition-colors border-r border-gray-300"
        >
          <div className="flex items-center gap-2">
            <FaUsers className="text-cercooffro-primary" />
            <div>
              <p className="text-sm font-medium">{t('who')}</p>
              <p className="text-sm text-gray-500 truncate">
                {typeof guests === 'number' && guests > 0 
                  ? `${guests} ${t('students')}` 
                  : t('addGuests')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Buttons */}
        <div className="flex items-stretch">
          <button 
            onClick={() => toggleFilterDropdown()}
            className="px-4 flex items-center gap-4 text-gray-600 hover:text-cercooffro-primary hover:bg-gray-50  transition-colors rounded-r-full "
            aria-label={t('filters.title')}
          >
            <FaFilter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              // Handle search
              console.log('Search clicked');
            }}
            className="px-6 py5 gap-2 flex items-center rounded-full bg-cercooffro-primary text-white hover:bg-cercooffro-primary/90 transition-colors"
            aria-label={t('search')}
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dropdowns */}
      {isLocationDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <LocationDropdown onClose={() => toggleLocationDropdown(false)} />
        </Suspense>
      )}

      {isDatesDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <DatesDropdown onClose={() => toggleDatesDropdown(false)} />
        </Suspense>
      )}

      {isGuestsDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <GuestsDropdown onClose={() => toggleGuestsDropdown(false)} />
        </Suspense>
      )}

      {isFilterDropdownOpen && (
        <Suspense fallback={<div className="mt-2 p-4 bg-white rounded-lg shadow-lg">{t('loading')}</div>}>
          <FilterDropdown onClose={() => toggleFilterDropdown(false)} />
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
            <Link href="/about" className="text-gray-700 hover:text-cercooffro-primary">
              {t('navbar.about')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-cercooffro-primary">
              {t('navbar.contact')}
            </Link>
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
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-cercooffro-primary"
            >
              {t('navbar.about')}
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-cercooffro-primary"
            >
              {t('navbar.contact')}
            </Link>
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
