'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('termsTitle')}</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {currentDate}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('acceptanceOfTerms')}</h2>
          <p className="mb-4">{t('termsAcceptanceText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('serviceDescription')}</h2>
          <p className="mb-4">{t('serviceDescriptionText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('userRights')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('accessRights')}</li>
            <li>{t('useRights')}</li>
            <li>{t('complianceRights')}</li>
            <li>{t('securityRights')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('intellectualProperty')}</h2>
          <p className="mb-4">{t('intellectualPropertyText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('dataProtection')}</h2>
          <p className="mb-4">{t('dataProtectionText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('propertyListings')}</h2>
          <p className="mb-4">{t('propertyListingsText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('liability')}</h2>
          <p className="mb-4">{t('liabilityText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disputes')}</h2>
          <p className="mb-4">{t('disputesText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('changes')}</h2>
          <p className="mb-4">{t('changesText')}</p>
        </section>
      </div>
    </div>
  );
}
