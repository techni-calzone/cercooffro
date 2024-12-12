'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ClientLayout } from '@/components/layout';
import { toast } from 'react-hot-toast';

interface SearcherProfile {
  id: string;
  email: string;
  name: string;
  preferences: {
    maxPrice?: number;
    preferredLocations?: string[];
    propertyTypes?: string[];
  };
  savedSearches: {
    id: string;
    criteria: Record<string, any>;
    createdAt: string;
  }[];
}

export default function SearcherProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<SearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/searcher/profile`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(t('profile.error.fetch'));
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user?.token, t]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cercooffro-primary"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!profile) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('profile.error.notFound')}
          </h1>
          <p className="text-gray-600">{t('profile.error.tryAgain')}</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('profile.personalInfo')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t('profile.email')}
              </label>
              <p className="mt-1">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t('profile.name')}
              </label>
              <p className="mt-1">{profile.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('profile.preferences')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t('profile.maxPrice')}
              </label>
              <p className="mt-1">
                {profile.preferences.maxPrice
                  ? `€${profile.preferences.maxPrice}`
                  : t('profile.notSet')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t('profile.preferredLocations')}
              </label>
              <div className="mt-1">
                {profile.preferences.preferredLocations?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferences.preferredLocations.map((location) => (
                      <span
                        key={location}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>{t('profile.notSet')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('profile.savedSearches')}</h2>
          {profile.savedSearches.length > 0 ? (
            <div className="space-y-4">
              {profile.savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {Object.entries(search.criteria)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">{t('profile.noSavedSearches')}</p>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
