'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SearcherProfile } from '../types/SearcherProfile';
import { FaUserFriends } from 'react-icons/fa';

const LOCATIONS = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 
  'Napoli', 'Palermo', 'Genova', 'Venice', 'Verona'
];

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
        {/* Telegram Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('searchersPage.telegramUsername')}
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
            placeholder="@username"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            required
          />
        </div>

        {/* Personal Information Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.personalInfo.age')}
            </label>
            <input 
              type="number" 
              value={profile.personalInfo?.age}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo!,
                  age: Number(e.target.value)
                }
              }))}
              min={0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.personalInfo.nationality')}
            </label>
            <input 
              type="text" 
              value={profile.personalInfo?.nationality}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo!,
                  nationality: e.target.value
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.personalInfo.sex')}
            </label>
            <select
              value={profile.personalInfo?.sex}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo!,
                  sex: e.target.value as Sex
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            >
              {getTranslationOptions('sexOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.personalInfo.email')}
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.personalInfo.phoneNumber')}
            </label>
            <input 
              type="tel" 
              value={profile.personalInfo?.contactInfo?.phoneNumber}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo!,
                  contactInfo: {
                    ...prev.personalInfo!.contactInfo!,
                    phoneNumber: e.target.value
                  }
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>
        </div>

        {/* Academic Profile Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* University */}
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

          {/* Study Level */}
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
              {getTranslationOptions('studyLevelOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Study Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.academicProfile.studyField')}
            </label>
            <select
              value={profile.academicProfile?.studyField}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                academicProfile: {
                  ...prev.academicProfile!,
                  studyField: e.target.value as StudyField
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            >
              {getTranslationOptions('studyFieldOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.academicProfile.department')}
            </label>
            <input 
              type="text" 
              value={profile.academicProfile?.department}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                academicProfile: {
                  ...prev.academicProfile!,
                  department: e.target.value
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>

          {/* Expected Graduation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.academicProfile.expectedGraduation')}
            </label>
            <input 
              type="date" 
              value={profile.academicProfile?.expectedGraduation?.toISOString().split('T')[0]}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                academicProfile: {
                  ...prev.academicProfile!,
                  expectedGraduation: new Date(e.target.value)
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>
        </div>

        {/* Financial Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.financialInfo.monthlyIncome')} (€)
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
              min={0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>

          {/* Financial Status */}
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
                  financialStatus: e.target.value as FinancialStatus
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            >
              {getTranslationOptions('financialStatusOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.financialInfo.budgetPreference')}
            </label>
            <div className="flex space-x-4">
              <input 
                type="number" 
                value={profile.financialInfo?.budgetPreference.min}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  financialInfo: {
                    ...prev.financialInfo!,
                    budgetPreference: { 
                      ...prev.financialInfo!.budgetPreference, 
                      min: Number(e.target.value) 
                    }
                  }
                }))}
                min={100}
                max={2000}
                className="w-full rounded-md border-gray-300"
                placeholder="Min Budget"
              />
              <input 
                type="number" 
                value={profile.financialInfo?.budgetPreference.max}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  financialInfo: {
                    ...prev.financialInfo!,
                    budgetPreference: { 
                      ...prev.financialInfo!.budgetPreference, 
                      max: Number(e.target.value) 
                    }
                  }
                }))}
                min={100}
                max={2000}
                className="w-full rounded-md border-gray-300"
                placeholder="Max Budget"
              />
            </div>
          </div>
        </div>

        {/* Housing Preferences Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Desired Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.housingPreferences.desiredLocation')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map(location => (
                <label key={location} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.housingPreferences?.desiredLocation.includes(location)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setProfile(prev => ({
                        ...prev,
                        housingPreferences: {
                          ...prev.housingPreferences!,
                          desiredLocation: isChecked
                            ? [...prev.housingPreferences!.desiredLocation, location]
                            : prev.housingPreferences!.desiredLocation.filter(l => l !== location)
                        }
                      }));
                    }}
                    className="form-checkbox text-cercooffro-primary"
                  />
                  <span className="ml-2">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.housingPreferences.moveInDate')}
            </label>
            <input 
              type="date" 
              value={profile.housingPreferences?.moveInDate.toISOString().split('T')[0]}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                housingPreferences: {
                  ...prev.housingPreferences!,
                  moveInDate: new Date(e.target.value)
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          {/* Stay Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.housingPreferences.stayDuration')}
            </label>
            <div className="flex space-x-4">
              <input 
                type="number" 
                value={profile.housingPreferences?.stayDuration.min}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  housingPreferences: {
                    ...prev.housingPreferences!,
                    stayDuration: { 
                      ...prev.housingPreferences!.stayDuration, 
                      min: Number(e.target.value) 
                    }
                  }
                }))}
                min={1}
                max={24}
                className="w-full rounded-md border-gray-300"
                placeholder="Min Months"
              />
              <input 
                type="number" 
                value={profile.housingPreferences?.stayDuration.max}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  housingPreferences: {
                    ...prev.housingPreferences!,
                    stayDuration: { 
                      ...prev.housingPreferences!.stayDuration, 
                      max: Number(e.target.value) 
                    }
                  }
                }))}
                min={1}
                max={24}
                className="w-full rounded-md border-gray-300"
                placeholder="Max Months"
              />
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.housingPreferences.groupSize')}
            </label>
            <input 
              type="number" 
              value={profile.housingPreferences?.groupSize}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                housingPreferences: {
                  ...prev.housingPreferences!,
                  groupSize: Number(e.target.value)
                }
              }))}
              min={1}
              max={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            />
          </div>
        </div>

        {/* Lifestyle Preferences Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Smoking Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.lifestylePreferences.smokingPreference')}
            </label>
            <select
              value={profile.lifestylePreferences?.smokingPreference}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                lifestylePreferences: {
                  ...prev.lifestylePreferences!,
                  smokingPreference: e.target.value as SmokingPreference
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            >
              {getTranslationOptions('smokingPreferenceOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Alcohol Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.lifestylePreferences.alcoholPreference')}
            </label>
            <select
              value={profile.lifestylePreferences?.alcoholPreference}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                lifestylePreferences: {
                  ...prev.lifestylePreferences!,
                  alcoholPreference: e.target.value as AlcoholPreference
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring focus:ring-cercooffro-primary/50"
            >
              {getTranslationOptions('alcoholPreferenceOptions').map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('searchersPage.lifestylePreferences.dietaryRestrictions')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {getTranslationOptions('dietaryRestrictionsOptions').map((option: string) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.lifestylePreferences?.dietaryRestrictions.includes(option)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setProfile(prev => ({
                        ...prev,
                        lifestylePreferences: {
                          ...prev.lifestylePreferences!,
                          dietaryRestrictions: isChecked
                            ? [...prev.lifestylePreferences!.dietaryRestrictions, option]
                            : prev.lifestylePreferences!.dietaryRestrictions.filter(r => r !== option)
                        }
                      }));
                    }}
                    className="form-checkbox text-cercooffro-primary"
                  />

                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            {t('searchersPage.form.cancel')}
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-cercooffro-primary text-white rounded-md hover:bg-opacity-90"
          >
            {t('searchersPage.form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};
