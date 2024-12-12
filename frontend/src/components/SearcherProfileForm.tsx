'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SearcherProfile } from '../types/SearcherProfile';
import { FaUserFriends } from 'react-icons/fa';

const LOCATIONS = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 
  'Napoli', 'Palermo', 'Genova', 'Venice', 'Verona'
];

const STUDY_LEVELS = ['Undergraduate', 'Graduate', 'PhD', 'Postdoc'];
const FINANCIAL_STATUSES = ['Student', 'Working Student', 'Scholarship', 'Other'];
const SEX_OPTIONS = ['Male', 'Female', 'Other'];

export const SearcherProfileForm: React.FC<{
  onCancel?: () => void;
  onSubmit?: () => void;
}> = ({ onCancel, onSubmit }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Partial<SearcherProfile>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      age: undefined,
      nationality: '',
      sex: 'Other',
      contactInfo: {
        telegramUsername: '',
        email: '',
        phoneNumber: ''
      }
    },
    academicProfile: {
      university: '',
      studyLevel: 'Undergraduate',
      studyField: 'Other',
      department: '',
      expectedGraduation: undefined
    },
    financialInfo: {
      monthlyIncome: 0,
      financialStatus: 'Student',
      budgetPreference: { min: 300, max: 800 }
    },
    housingPreferences: {
      desiredLocation: [],
      moveInDate: new Date(),
      stayDuration: { min: 3, max: 12 },
      groupSize: 1,
      preferredRoommates: []
    },
    lifestylePreferences: {
      smokingPreference: 'Non-Smoker',
      alcoholPreference: 'Non-Drinker',
      dietaryRestrictions: [],
      petFriendly: false,
      additionalTags: []
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      profileCompleteness: 0
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('Submitting profile:', profile);
    onSubmit?.();
  };

  // Safely get translation options
  const getTranslationOptions = (key: string): string[] => {
    const options = t(`searchersPage.${key}`, { returnObjects: true });
    return Array.isArray(options) ? options : [];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <FaUserFriends className="w-8 h-8 mr-3 text-cercooffro-primary" />
        <h2 className="text-2xl font-bold text-gray-800">
          {t('searchersPage.title')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('searchersPage.personalInfo.title')}</h3>
            
          {/* Contact Information */}
          <div className="mb-4">
            <h4 className="text-md font-medium mb-3">{t('searchersPage.personalInfo.contactInfo.title')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('searchersPage.personalInfo.contactInfo.telegramUsername')}
                </label>
                <input 
                  type="text"
                  value={profile.personalInfo?.contactInfo?.telegramUsername}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo!,
                      contactInfo: {
                        ...prev.personalInfo!.contactInfo!,
                        telegramUsername: e.target.value
                      }
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('searchersPage.personalInfo.contactInfo.email')}
                </label>
                <input 
                  type="email"
                  value={profile.personalInfo?.contactInfo?.email}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo!,
                      contactInfo: {
                        ...prev.personalInfo!.contactInfo!,
                        email: e.target.value
                      }
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.personalInfo.firstName')}
              </label>
              <input 
                type="text"
                value={profile.personalInfo?.firstName}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo!,
                    firstName: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.personalInfo.lastName')}
              </label>
              <input 
                type="text"
                value={profile.personalInfo?.lastName}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo!,
                    lastName: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.personalInfo.sex')}
              </label>
              <select
                value={profile.personalInfo?.sex || ''}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo!,
                    sex: e.target.value as Sex
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              >
                <option value="">{t('common.select')}</option>
                {SEX_OPTIONS.map((option: string) => (
                  <option key={option} value={option}>{t(`searchersPage.options.sex.${option.toLowerCase()}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Academic Profile Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('searchersPage.academicProfile.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.academicProfile.university')}
              </label>
              <input 
                type="text"
                value={profile.academicProfile?.university}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  academicProfile: {
                    ...prev.academicProfile!,
                    university: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.academicProfile.studyLevel')}
              </label>
              <select
                value={profile.academicProfile?.studyLevel}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  academicProfile: {
                    ...prev.academicProfile!,
                    studyLevel: e.target.value as StudyLevel
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              >
                <option value="">{t('common.select')}</option>
                {STUDY_LEVELS.map((option: string) => (
                  <option key={option} value={option}>{t(`searchersPage.options.studyLevel.${option.toLowerCase()}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{t('searchersPage.financialInfo.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.financialInfo.monthlyIncome')}
              </label>
              <input 
                type="number"
                value={profile.financialInfo?.monthlyIncome}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  financialInfo: {
                    ...prev.financialInfo!,
                    monthlyIncome: Number(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('searchersPage.financialInfo.financialStatus')}
              </label>
              <select
                value={profile.financialInfo?.financialStatus}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  financialInfo: {
                    ...prev.financialInfo!,
                    financialStatus: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
              >
                <option value="">{t('common.select')}</option>
                {FINANCIAL_STATUSES.map((option: string) => (
                  <option key={option} value={option}>{t(`searchersPage.options.financialStatus.${option.toLowerCase().replace(' ', '_')}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercooffro-primary"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-cercooffro-primary border border-transparent rounded-md hover:bg-cercooffro-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercooffro-primary"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};
