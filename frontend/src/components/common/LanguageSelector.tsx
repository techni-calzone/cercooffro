'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FaGlobeEurope } from 'react-icons/fa';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex(lang => lang.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex].code);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleLanguage}
        className="
          flex 
          items-center 
          space-x-2 
          text-sm 
          text-gray-700 
          hover:bg-gray-100 
          px-3 
          py-2 
          rounded-full 
          transition
        "
      >
        <FaGlobeEurope className="text-cercooffro-primary" />
        <span>
          {languages.find(lang => lang.code === language)?.flag}{' '}
          {languages.find(lang => lang.code === language)?.name}
        </span>
      </button>
    </div>
  );
}
