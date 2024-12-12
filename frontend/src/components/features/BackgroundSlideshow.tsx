'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export const SLIDESHOW_IMAGES = [
  {
    src: '/images/campus-1.jpg',
    alt: 'Beautiful Italian University Campus',
    heroTitle: {
      en: 'Discover Italian Campus Living',
      it: 'Scopri la Vita nei Campus Italiani'
    },
    heroSubtitle: {
      en: 'Your Journey Starts Here',
      it: 'Il Tuo Viaggio Inizia Qui'
    }
  },
  {
    src: '/images/campus-2.jpg',
    alt: 'Modern Student Housing in Milan',
    heroTitle: {
      en: 'Modern Student Accommodations',
      it: 'Sistemazioni Studentesche Moderne'
    },
    heroSubtitle: {
      en: 'Comfort Meets Convenience',
      it: 'Comfort e Convenienza'
    }
  },
  {
    src: '/images/campus-3.jpg',
    alt: 'Historic Student Residence in Bologna',
    heroTitle: {
      en: 'Historic Living Spaces',
      it: 'Spazi Storici per Vivere'
    },
    heroSubtitle: {
      en: 'Where History Meets Education',
      it: 'Dove la Storia Incontra l\'Educazione'
    }
  },
  {
    src: '/images/campus-4.jpg',
    alt: 'Scenic University View in Rome',
    heroTitle: {
      en: 'Academic Destinations',
      it: 'Destinazioni Accademiche'
    },
    heroSubtitle: {
      en: 'Your Academic Adventure Awaits',
      it: 'La Tua Avventura Accademica ti Aspetta'
    }
  },
  {
    src: '/images/campus-5.jpg',
    alt: 'Vibrant Student Community in Florence',
    heroTitle: {
      en: 'Student Community Living',
      it: 'Vivere in Comunità Studentesca'
    },
    heroSubtitle: {
      en: 'Connect, Learn, Grow',
      it: 'Connettiti, Impara, Cresci'
    }
  }
];

export default function BackgroundSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {SLIDESHOW_IMAGES.map((image, index) => (
        <div 
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <Image 
            src={image.src} 
            alt={image.alt}
            fill
            priority={index === 0}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-center filter brightness-50"
          />
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {SLIDESHOW_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
