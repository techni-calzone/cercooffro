'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SLIDESHOW_IMAGES } from './BackgroundSlideshow';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentImage = SLIDESHOW_IMAGES[currentSlide];

  return (
    <div className="text-center w-full px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 
          animate-fade-in-up"
        >
          {currentImage.heroTitle[language as 'en' | 'it']}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto px-4 
          animate-fade-in-up animation-delay-300"
        >
          {currentImage.heroSubtitle[language as 'en' | 'it']}
        </p>
      </div>
    </div>
  );
}
