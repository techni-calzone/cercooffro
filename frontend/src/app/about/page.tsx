'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('about.aboutTitle')}</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('about.ourMission')}</h2>
          <p className="mb-4">{t('about.missionText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('about.whatWeOffer')}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('about.comprehensiveListings')}</li>
            <li>{t('about.easyToUseSearch')}</li>
            <li>{t('about.detailedInfo')}</li>
            <li>{t('about.multiLanguageSupport')}</li>
            <li>{t('about.directContact')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
