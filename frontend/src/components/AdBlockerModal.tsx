'use client';

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaShieldAlt, FaHeart } from 'react-icons/fa';

export default function AdBlockerModal() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check if user has previously bypassed ad blocker
    if (typeof window !== 'undefined') {
      const bypassExpiry = localStorage.getItem('adBlockerBypassExpiry');
      if (bypassExpiry && Date.now() < parseInt(bypassExpiry)) {
        return;
      }
    }

    const checkAdBlocker = () => {
      // Comprehensive ad blocker detection
      const detectMethods = [
        // Check for AdBlocker Plus specific signatures
        () => {
          return !!(
            (window as any).AdBlock ||
            (window as any).chrome?.runtime?.sendMessage ||
            document.querySelector('iframe[src*="adblock"]') ||
            (window as any).__adblockplus ||
            (window as any).adblocker ||
            document.body.getAttribute('data-adblockkey')
          );
        },
        
        // DOM-based detection
        () => {
          const testAd = document.createElement('div');
          testAd.innerHTML = '&nbsp;';
          testAd.className = 'adsbox testAd';
          testAd.style.cssText = 'position: absolute; top: -1px; left: -1px; width: 1px; height: 1px; visibility: hidden;';
          document.body.appendChild(testAd);
          
          const isBlocked = testAd.offsetHeight === 0;
          document.body.removeChild(testAd);
          return isBlocked;
        },
        
        // AdSense script loading check
        () => {
          const isAdSenseAvailable = typeof (window as any).adsbygoogle !== 'undefined';
          const isAdSenseLoaded = document.querySelector('script[src*="adsbygoogle"]') !== null;
          return !(isAdSenseAvailable && isAdSenseLoaded);
        },
        
        // Network request blocking
        () => {
          return new Promise((resolve) => {
            const testImage = new Image();
            testImage.onload = () => resolve(false);
            testImage.onerror = () => resolve(true);
            testImage.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            setTimeout(() => resolve(false), 1500); // Assume no blocking if timeout
          });
        }
      ];

      // Run detection methods
      const runDetection = async () => {
        let blocked = false;
        for (const method of detectMethods) {
          try {
            const result = await Promise.resolve(method());
            if (result) {
              blocked = true;
              break;
            }
          } catch {
            continue;
          }
        }
        setIsBlocked(blocked);
      };

      runDetection();
    };

    // Initial check
    checkAdBlocker();

    // Set up periodic checks
    const intervalId = setInterval(checkAdBlocker, 5000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Prevent server-side rendering issues
  if (typeof window === 'undefined') return null;

  // Check localStorage bypass
  if (typeof window !== 'undefined' && localStorage.getItem('adBlockerBypassed') === 'true') {
    const expiry = localStorage.getItem('adBlockerBypassExpiry');
    if (expiry && Date.now() < parseInt(expiry)) {
      return null;
    }
  }

  if (!isBlocked) return null;

  const handleDonationBypass = () => {
    // Open donation page and set bypass
    localStorage.setItem('adBlockerBypassed', 'true');
    localStorage.setItem('adBlockerBypassExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString());
    window.open('/donate', '_blank');
    setIsBlocked(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl transform transition-all">
        <FaShieldAlt className="mx-auto text-6xl text-red-500 mb-6" />
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ad Blocker Detected
        </h2>
        
        <p className="text-gray-600 mb-6">
          We rely on ads to provide our free service. Please consider supporting us.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => {
              window.open('https://www.google.com/adsense/support/answer/12668?hl=en', '_blank');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <FaExclamationTriangle className="mr-2" />
            Learn How to Whitelist
          </button>
          
          <button 
            onClick={handleDonationBypass}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
          >
            <FaHeart className="mr-2" />
            Visit Donation Page to Skip for 24h
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          By continuing, some features may be restricted.
        </p>
      </div>
    </div>
  );
}
