'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaHandsHelping, 
  FaUsers, 
  FaHeart, 
  FaArrowRight, 
  FaArrowLeft,
  FaCode,
  FaGithub,
  FaCoffee
} from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const communitySlides = [
  {
    icon: FaShieldAlt,
    titleKey: 'communityGuardianTitle',
    descriptionKey: 'communityGuardianDescription',
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    icon: FaCode,
    titleKey: 'openSourceTitle',
    descriptionKey: 'openSourceDescription',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    cta: {
      textKey: 'contributeOnGitHub',
      link: 'https://github.com/your-org/student-rental-aggregator',
      icon: FaGithub
    }
  },
  {
    icon: FaHandsHelping,
    titleKey: 'supportPeersTitle',
    descriptionKey: 'supportPeersDescription',
    color: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    icon: FaUsers,
    titleKey: 'communityDrivenTitle',
    descriptionKey: 'communityDrivenDescription',
    color: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  {
    icon: FaHeart,
    titleKey: 'makeADifferenceTitle',
    descriptionKey: 'makeADifferenceDescription',
    color: 'bg-red-100',
    textColor: 'text-red-800',
    cta: {
      textKey: 'buyMeACoffee',
      link: 'https://www.buymeacoffee.com/studentrental',
      icon: FaCoffee
    }
  }
];

export default function CommunityBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % communitySlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % communitySlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + communitySlides.length) % communitySlides.length);
  };

  const currentSlideData = communitySlides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Slide Container */}
        <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-lg">
          {/* Sliding Content */}
          <div 
            className={`
              absolute inset-0 flex items-center justify-between p-8 transition-transform duration-500 ease-in-out
              ${currentSlideData.color} ${currentSlideData.textColor}
            `}
            style={{ transform: `translateX(0%)` }}
          >
            {/* Left Arrow */}
            <button 
              onClick={handlePrevSlide} 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2"
            >
              <FaArrowLeft className="text-white" />
            </button>

            {/* Content */}
            <div className="flex items-center space-x-8 w-full justify-center">
              <IconComponent className="text-6xl" />
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">{t(currentSlideData.titleKey)}</h2>
                <p className="text-lg">{t(currentSlideData.descriptionKey)}</p>
                
                {/* CTA for Slides */}
                {currentSlideData.cta && (
                  <Link 
                    href={currentSlideData.cta.link} 
                    target="_blank" 
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <currentSlideData.cta.icon className="mr-2 -ml-1" />
                    {t(currentSlideData.cta.textKey)}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={handleNextSlide} 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2"
            >
              <FaArrowRight className="text-white" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {communitySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-3 h-3 rounded-full 
                ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
