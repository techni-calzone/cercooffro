'use client';

import React, { useState } from 'react';
import { SearcherProfileForm } from '@/components/features/search/SearcherProfileForm';
import { SearcherProfileList } from '@/components/features/search/SearcherProfileList';
import { useLanguage } from '@/context/LanguageContext';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import SimpleNavbar from '@/components/layout/SimpleNavbar';

export default function SearchersPage() {
  const { t } = useLanguage();
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  return (
    <>
      <SimpleNavbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <FaUserFriends className="w-10 h-10 text-cercooffro-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t('searchers.title')}
              </h1>
              <p className="text-gray-600">
                {t('searchers.subtitle')}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateProfile(!showCreateProfile)}
            className="flex items-center space-x-2 bg-cercooffro-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
          >
            <FaPlus className="w-5 h-5" />
            <span>{t('searchers.addProfile')}</span>
          </button>
        </div>

        {showCreateProfile && (
          <div className="mb-8">
            <SearcherProfileForm 
              onCancel={() => setShowCreateProfile(false)}
              onSubmit={() => {
                // TODO: Implement profile submission logic
                setShowCreateProfile(false);
              }} 
            />
          </div>
        )}

        <SearcherProfileList />
      </div>
    </>
  );
}
