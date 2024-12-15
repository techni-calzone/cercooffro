'use client';

import React, { useEffect, useState } from 'react';
import { adsenseConfig, antiAdblockConfig } from '@/config/adsense';
import AdBlockerModal from './AdBlockerModal';

interface GoogleAdProps {
  adSlot: string;
  adStyle?: object;
  className?: string;
  debug?: boolean;
}

export default function GoogleAd({
  adSlot,
  adStyle = {},
  className = '',
  debug = false
}: GoogleAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdEmpty, setIsAdEmpty] = useState(false);

  useEffect(() => {
    // Check if ad is rendered
    const checkAdRendered = () => {
      const adElement = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
      if (adElement) {
        const computedStyle = window.getComputedStyle(adElement);
        if (computedStyle.display === 'none' || adElement.clientHeight === 0) {
          setIsAdEmpty(true);
        }
      }
    };

    const timeoutId = setTimeout(checkAdRendered, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [adSlot]);

  return (
    <>
      {isVisible && (
        <div 
          className={`w-full flex justify-center items-center ${className}`}
          data-testid="google-ad"
        >
          {debug && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">
              Debug: Rendering Google Ad
            </div>
          )}
          
          {!isAdEmpty && (
            <ins 
              className="adsbygoogle"
              style={{ display: 'block', ...adStyle }}
              data-ad-client={adsenseConfig.clientId}
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )}
        </div>
      )}
      <AdBlockerModal />
    </>
  );
}
