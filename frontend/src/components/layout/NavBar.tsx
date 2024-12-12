'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaKey,
  FaTimes,
  FaBars,
  FaGlobe,
  FaHome,
  FaPlusCircle,
  FaInfoCircle,
  FaUserPlus,
  FaSignInAlt
} from 'react-icons/fa';

import { useLanguage } from '@/context/LanguageContext';
import SearchBar from '../features/search/SearchBar';

const NavBranding = () => {
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

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200"
        aria-label="Select language"
      >
        <FaGlobe className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-2 text-sm ${
                language === 'en'
                  ? 'bg-cercooffro-primary/10 text-cercooffro-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              } flex items-center space-x-2`}
              role="menuitem"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
            <button
              onClick={() => handleLanguageChange('it')}
              className={`w-full text-left px-4 py-2 text-sm ${
                language === 'it'
                  ? 'bg-cercooffro-primary/10 text-cercooffro-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              } flex items-center space-x-2`}
              role="menuitem"
            >
              <span>🇮🇹</span>
              <span>Italiano</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavLinks = () => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/listings" className="px-3 py-2 rounded-md text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
        <FaHome className="w-4 h-4" />
        {t('navbar.listings')}
      </Link>
      <Link href="/listings/new" className="px-3 py-2 rounded-md text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
        <FaPlusCircle className="w-4 h-4" />
        {t('navbar.addListing')}
      </Link>
      <Link href="/about" className="px-3 py-2 rounded-md text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
        <FaInfoCircle className="w-4 h-4" />
        {t('navbar.about')}
      </Link>
    </div>
  );
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First row with main navigation */}
        <div className="flex justify-between h-16 items-center">
          <NavBranding />
          <div className="flex items-center space-x-4">
            <NavLinks />
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <span className="flex items-center">
                  <FaSignInAlt className="mr-2" />
                  {t('navbar.login')}
                </span>
              </Link>
            </div>
            <LanguageSelector />
          </div>
        </div>
        
        {/* Second row with SearchBar */}
        <div className="pb-4">
          <SearchBar 
            onLocationSelect={() => {}}
            onDatesSelect={() => {}}
            onGuestsSelect={() => {}}
            onFiltersApply={() => {}}
            onSearch={() => {}}
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/listings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <FaHome className="w-4 h-4" />
            {t('navbar.listings')}
          </Link>
          <Link href="/add-listing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <FaPlusCircle className="w-4 h-4" />
            {t('navbar.addListing')}
          </Link>
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
            <FaInfoCircle className="w-4 h-4" />
            {t('navbar.about')}
          </Link>
          {/* Language Selector in Mobile Menu */}
          <div className="px-3 py-2">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
