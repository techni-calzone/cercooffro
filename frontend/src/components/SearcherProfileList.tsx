'use client';

import React, { useState, useEffect } from 'react';
import { SearcherProfile } from '@/types/SearcherProfile';
import { useLanguage } from '@/context/LanguageContext';
import { 
  FaTelegram, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUserFriends, 
  FaUsers, 
  FaTags,
  FaFlag,
  FaTransgender,
  FaEuroSign
} from 'react-icons/fa';

// Mock data - will be replaced with actual API call
const MOCK_PROFILES: SearcherProfile[] = [
  {
    id: '1',
    telegramUsername: '@studentMilano',
    personalInfo: {
      nationality: 'Italian',
      sex: 'Female',
      monthlyIncome: 800
    },
    requirements: {
      budget: { min: 400, max: 600 },
      location: ['Milano'],
      moveInDate: new Date('2024-02-01'),
      duration: { min: 6, max: 12 },
      groupSize: 2
    },
    preferences: {
      tags: ['Okay with Subrenting', 'Non-Smokers']
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '2',
    telegramUsername: '@romaStudent',
    personalInfo: {
      nationality: 'International',
      sex: 'Other',
      monthlyIncome: 600
    },
    requirements: {
      budget: { min: 350, max: 500 },
      location: ['Roma', 'Napoli'],
      moveInDate: new Date('2024-03-15'),
      duration: { min: 3, max: 9 },
      groupSize: 3
    },
    preferences: {
      tags: ['International Students Welcome', 'LGBTQ+ Friendly']
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

export const SearcherProfileList: React.FC = () => {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<SearcherProfile[]>([]);
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 2000,
    locations: [] as string[]
  });

  const LOCATIONS = [
    'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 
    'Napoli', 'Genova', 'Venezia', 'Padova', 'Pisa'
  ];

  useEffect(() => {
    // TODO: Replace with actual API call
    setProfiles(MOCK_PROFILES);
  }, []);

  const filteredProfiles = profiles.filter(profile => 
    (profile.requirements.budget.min >= filters.minBudget && 
     profile.requirements.budget.max <= filters.maxBudget) &&
    (filters.locations.length === 0 || 
     profile.requirements.location.some(loc => filters.locations.includes(loc)))
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Advanced Filters */}
      <div className="bg-gray-50 p-6 border-b">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('searchersPage.requirements.budget')}
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input 
                  type="number" 
                  placeholder={t('searchersPage.requirements.budget')}
                  value={filters.minBudget}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    minBudget: Number(e.target.value)
                  }))}
                  className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:ring-cercooffro-primary focus:border-cercooffro-primary"
                />
              </div>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input 
                  type="number" 
                  placeholder={t('searchersPage.requirements.budget')}
                  value={filters.maxBudget}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    maxBudget: Number(e.target.value)
                  }))}
                  className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:ring-cercooffro-primary focus:border-cercooffro-primary"
                />
              </div>
            </div>
          </div>

          {/* Location Multiselect */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('searchersPage.requirements.location')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map(location => (
                <label key={location} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(location)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFilters(prev => ({
                        ...prev,
                        locations: isChecked
                          ? [...prev.locations, location]
                          : prev.locations.filter(l => l !== location)
                      }));
                    }}
                    className="form-checkbox text-cercooffro-primary rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-end">
            <div className="bg-cercooffro-primary/10 px-4 py-2 rounded-md">
              <p className="text-sm text-cercooffro-primary font-medium">
                {filteredProfiles.length} {t('searchersPage.results')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FaUserFriends className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>{t('searchersPage.noResults')}</p>
          </div>
        ) : (
          filteredProfiles.map(profile => (
            <div 
              key={profile.id} 
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-cercooffro-primary/10 p-3 rounded-full mr-4">
                    <FaTelegram className="w-8 h-8 text-cercooffro-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {profile.telegramUsername}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FaMoneyBillWave className="w-5 h-5 text-green-500" />
                    <span>
                      €{profile.requirements.budget.min} - 
                      €{profile.requirements.budget.max}/month
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-500" />
                    <span>{profile.requirements.location.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="w-5 h-5 text-purple-500" />
                    <span>
                      {t('searchersPage.moveIn')}: {profile.requirements.moveInDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUsers className="w-5 h-5 text-indigo-500" />
                    <span>
                      {profile.requirements.groupSize} {t('searchersPage.people')}
                    </span>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {/* Nationality */}
                  <div className="flex items-center space-x-2">
                    <FaFlag className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      {profile.personalInfo.nationality}
                    </span>
                  </div>

                  {/* Sex */}
                  <div className="flex items-center space-x-2">
                    <FaTransgender className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      {profile.personalInfo.sex}
                    </span>
                  </div>

                  {/* Monthly Income */}
                  <div className="flex items-center space-x-2">
                    <FaEuroSign className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">
                      {t('searchersPage.personalInfo.monthlyIncome')}: 
                      {profile.personalInfo.monthlyIncome}€
                    </span>
                  </div>
                </div>

                {profile.preferences.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaTags className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t('searchersPage.requirements.tags')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button 
                    className="w-full bg-cercooffro-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors group-hover:bg-opacity-100"
                    onClick={() => {
                      // TODO: Implement contact/connect logic
                      window.open(`https://t.me/${profile.telegramUsername.replace('@', '')}`, '_blank');
                    }}
                  >
                    {t('searchersPage.contactRoommate')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
