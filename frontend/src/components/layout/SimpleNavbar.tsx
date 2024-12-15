'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  FaHome, 
  FaSearch, 
  FaUsers,
  FaInfoCircle, 
  FaEnvelope, 
  FaKey, 
  FaCommentDots,
  FaGlobe, 
  FaTimes, 
  FaBars,
  FaUser, 
  FaList,
  FaSignOutAlt,
  FaSignInAlt
} from 'react-icons/fa';
import FeedbackModal from '@/components/features/feedback/FeedbackModal';

export default function SimpleNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { 
      href: "/listings", 
      label: t('secondaryNavbar.listings'), 
      icon: FaHome 
    },
    { 
      href: "/searchers", 
      label: t('secondaryNavbar.roommates'), 
      icon: FaUsers 
    },
    { 
      href: "/about", 
      label: t('secondaryNavbar.about'), 
      icon: FaInfoCircle 
    },
    { 
      href: "/contact", 
      label: t('secondaryNavbar.contact'), 
      icon: FaEnvelope 
    }
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-cercooffro-primary flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center bg-cercooffro-primary rounded-full">
                  <FaKey className="w-6 h-6 text-white" />
                </div>
                <span>CercoOffro</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'text-cercooffro-primary bg-gray-50'
                    : 'text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50'
                } transition-colors duration-200 flex items-center gap-2`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {/* Feedback Button */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <FaCommentDots className="w-4 h-4" />
              {t('secondaryNavbar.feedback')}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 transition-colors duration-200"
              >
                <FaGlobe className="w-4 h-4" />
                <span>{language === 'en' ? 'EN' : 'IT'}</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('secondaryNavbar.english')}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('it')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('secondaryNavbar.italian')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50"
                >
                  <FaUser className="w-4 h-4" />
                  <span>{user.name || user.email}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('navbar.profile')}
                      </Link>
                      <Link
                        href="/my-listings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('navbar.myListings')}
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center">
                          <FaSignOutAlt className="w-4 h-4 mr-2" />
                          {t('navbar.logout')}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <span className="flex items-center">
                  <FaSignInAlt className="mr-2" />
                  {t('navbar.login')}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-cercooffro-primary bg-gray-50'
                      : 'text-gray-700 hover:text-cercooffro-primary hover:bg-gray-50'
                  } transition-colors duration-200 flex items-center gap-2`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              {!user && (
                <Link
                  href="/login"
                  className="block w-full px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                >
                  <span className="flex items-center">
                    <FaSignInAlt className="mr-2" />
                    {t('navbar.login')}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </nav>
  );
}
