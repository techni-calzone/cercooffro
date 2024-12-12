'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
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
  FaBars
} from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';

export default function SimpleNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { t, currentLanguage } = useLanguage();

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
    },
    { 
      href: "#", 
      label: t('secondaryNavbar.feedback'), 
      icon: FaCommentDots,
      onClick: () => setIsFeedbackModalOpen(true)
    }
  ];

  const handleLanguageChange = (lang: 'en' | 'it') => {
    localStorage.setItem('language', lang);
    window.location.reload(); // Refresh to apply language changes
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-cercooffro-primary rounded-full">
                <FaKey className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-cercooffro-primary">
                CercoOffro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              item.onClick ? (
                <div
                  key={item.href}
                  onClick={item.onClick}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-cercooffro-primary cursor-pointer`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2" />
                    {item.label}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-cercooffro-primary`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2" />
                    {item.label}
                  </div>
                </Link>
              )
            ))}
          </div>

          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className={`flex flex-col items-center justify-center ${
                isLanguageMenuOpen 
                  ? 'text-cercooffro-primary' 
                  : 'text-gray-500 hover:text-cercooffro-primary'
              } transition-colors`}
            >
              <FaGlobe className="w-6 h-6 mb-1" />
              <span className="text-xs">{t('secondaryNavbar.language')}</span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    currentLanguage === 'en' 
                      ? 'bg-cercooffro-primary/10 text-cercooffro-primary' 
                      : 'text-gray-700'
                  }`}
                >
                  {t('english')}
                </button>
                <button 
                  onClick={() => handleLanguageChange('it')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    currentLanguage === 'it' 
                      ? 'bg-cercooffro-primary/10 text-cercooffro-primary' 
                      : 'text-gray-700'
                  }`}
                >
                  {t('italian')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-cercooffro-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                item.onClick ? (
                  <div
                    key={item.href}
                    onClick={() => {
                      setIsMenuOpen(false);
                      item.onClick && item.onClick();
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-cercooffro-primary cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2" />
                      {item.label}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-cercooffro-primary`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2" />
                      {item.label}
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* Feedback Modal */}
        <FeedbackModal 
          isOpen={isFeedbackModalOpen} 
          onClose={() => setIsFeedbackModalOpen(false)} 
        />
      </div>
    </nav>
  );
}
