'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('privacyTitle')}</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {currentDate}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('introduction')}</h2>
          <p className="mb-4">{t('privacyIntroText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('personalData')}</h2>
          <p className="mb-4">{t('dataController')}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('contactInfo')}</li>
            <li>{t('accountCredentials')}</li>
            <li>{t('searchPreferences')}</li>
            <li>{t('deviceInfo')}</li>
            <li>{t('locationData')}</li>
            <li>{t('communicationHistory')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legalBasis')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('consent')}</li>
            <li>{t('contractPerformance')}</li>
            <li>{t('legalObligations')}</li>
            <li>{t('legitimateInterests')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('yourRights')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('accessData')}</li>
            <li>{t('rectifyData')}</li>
            <li>{t('eraseData')}</li>
            <li>{t('restrictProcessing')}</li>
            <li>{t('dataPortability')}</li>
            <li>{t('withdrawConsent')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('dataProtection')}</h2>
          <p className="mb-4">{t('dataProtectionText')}</p>
        </section>
      </div>
    </div>
  );
}
