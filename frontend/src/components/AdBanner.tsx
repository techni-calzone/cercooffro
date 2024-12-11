'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { adsenseConfig, antiAdblockConfig } from '@/config/adsense';
import AdBlockerModal from './AdBlockerModal';

interface AdBannerProps {
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  adSlot?: string;
}

export default function AdBanner({
  imageUrl, 
  title, 
  description, 
  ctaText, 
  ctaLink,
  adSlot
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdEmpty, setIsAdEmpty] = useState(false);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense script error:', error);
    }

    // Only run ad detection if an ad slot is provided
    if (adSlot) {
      const checkAdRendered = () => {
        const adElement = document.querySelector('.adsbygoogle');
        if (adElement) {
          // More robust ad detection
          const computedStyle = window.getComputedStyle(adElement);
          const isInvisible = computedStyle.display === 'none' || 
                               computedStyle.visibility === 'hidden' || 
                               adElement.clientHeight === 0;
          
          // Check for AdSense placeholder or blocked ad
          const isAdBlockPlaceholder = adElement.innerHTML.includes('Ads by Google') || 
                                       adElement.textContent?.trim() === 'Advertisement';
          
          setIsAdEmpty(isInvisible || isAdBlockPlaceholder);
        }
      };

      // Initial check
      checkAdRendered();

      // Delayed check to allow for ad rendering
      const timeoutId = setTimeout(checkAdRendered, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [adSlot]);

  const renderAdSenseAd = () => (
    <ins 
      className="adsbygoogle"
      style={{ display: 'block', width: '100%' }}
      data-ad-client={adsenseConfig.clientId}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );

  const DonationPlaceholder = () => (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row items-center mx-auto max-w-6xl my-8">
      <div className="md:w-1/3 w-full relative h-64 md:h-auto bg-green-100 flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 text-green-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </div>
      <div className="p-6 md:w-2/3 w-full">
        <h2 className="text-2xl font-bold text-cercooffro-primary mb-2">
          Support Our Platform
        </h2>
        <p className="text-gray-600 mb-4">
          We rely on community support to keep our services running. 
          Consider making a small donation to help us continue providing free resources for students.
        </p>
        <a 
          href="/donate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-cercooffro-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Donate Now
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
            />
          </svg>
        </a>
        <div className="text-xs text-gray-500 mt-2">
          Every contribution helps keep our platform running
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isVisible && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row items-center mx-auto max-w-6xl my-8">
          {/* If AdSense slot is provided, render AdSense ad or donation placeholder */}
          {adSlot ? (
            <div className="w-full p-4">
              {isAdEmpty ? (
                <DonationPlaceholder />
              ) : (
                renderAdSenseAd()
              )}
            </div>
          ) : (
            // Original custom ad design
            <>
              <div className="md:w-1/3 w-full relative h-64 md:h-auto">
                <Image 
                  src={imageUrl} 
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3 w-full">
                <h2 className="text-2xl font-bold text-cercooffro-primary mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>
                <a 
                  href={ctaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-cercooffro-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  {ctaText}
                  <FaExternalLinkAlt className="ml-2" />
                </a>
                <div className="text-xs text-gray-500 mt-2">
                  Sponsored Content
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <AdBlockerModal />
    </>
  );
}
