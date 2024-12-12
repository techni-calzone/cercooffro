'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaGithub, 
  FaHeart, 
  FaUsers, 
  FaHome, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaGraduationCap,
  FaCheckCircle,
  FaStar,
  FaUniversity
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';
import { ClientLayout, Footer, NavBar } from '@/components/layout';
import { HeroSection, BackgroundSlideshow, CommunityBanner } from '@/components/features';
import { AdBanner, AdBlockerModal, GoogleAd } from '@/components/features/ads/index';
import { TelegramLogin } from '@/components/features/auth';
import { SearcherCard } from '@/components/features/search';
import { FeedbackModal } from '@/components/features/feedback/index';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HomePage = () => {
  const { t } = useLanguage();
  // Placeholder data - replace with actual API calls
  const [recentListings] = useState([
    {
      id: 1,
      title: 'Modern Studio near University',
      location: 'Central Rome',
      price: '€500/month',
      image: '/images/placeholder-studio-2.jpg'
    },
    {
      id: 2,
      title: 'Shared Apartment',
      location: 'Milan Center',
      price: '€400/month',
      image: '/images/placeholder-room.jpg'
    },
    {
      id: 3,
      title: 'Student Room',
      location: 'Florence',
      price: '€350/month',
      image: '/images/placeholder-studio.jpg'
    }
  ]);

  const [recentSearchers] = useState([
    {
      id: 1,
      name: 'Marco',
      university: 'La Sapienza',
      lookingFor: 'Single Room',
      budget: '€400-600/month',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 2,
      name: 'Sofia',
      university: 'Politecnico di Milano',
      lookingFor: 'Shared Apartment',
      budget: '€300-500/month',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 3,
      name: 'Luca',
      university: 'Università di Bologna',
      lookingFor: 'Studio Apartment',
      budget: '€500-700/month',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 4,
      name: 'Maria',
      university: 'La Sapienza',
      lookingFor: 'Single Room',
      budget: '€500-700/month',
      avatar: '/placeholder-avatar.jpg'
    }
  ]);

  const valuePropositions: string[] = t('home.value_propositions') || [];
  const [currentProposition, setCurrentProposition] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!valuePropositions.length) return;
    
      let currentIndex = 0;
  const currentText = valuePropositions[currentProposition];

  const typingInterval = setInterval(() => {
    if (currentIndex <= currentText.length) {
      setDisplayText(currentText.slice(0, currentIndex)); // Corrected slicing
      currentIndex++;
    } else {
      clearInterval(typingInterval);
      // Wait for 2 seconds before moving to the next proposition
      setTimeout(() => {
        setCurrentProposition((prev) => (prev + 1) % valuePropositions.length);
      }, 2000);
    }
  }, 50); // Adjust typing speed here (lower = faster)

  return () => {
    clearInterval(typingInterval);
  };
}, [currentProposition, valuePropositions]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Value Proposition */}
      <section className="bg-gradient-to-r from-cercooffro-primary to-cercooffro-secondary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center text-white mb-16">
            <h1 className="text-4xl md:text-5xl py-12 font-bold mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl mb-8 text-white/90 min-h-[2em] flex items-center justify-center">
              {displayText}
              <span className="animate-blink ml-0.5">|</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/listings/new" className="bg-white text-cercooffro-primary px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-colors">
                {t('home.postListing')}
              </Link>
              <Link href="/listings" className="bg-cercooffro-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-colors">
                {t('home.findAccommodation')}
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">{t('home.activeListings')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-white/80">{t('home.happyStudents')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-white/80">{t('home.universities')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30+</div>
              <div className="text-white/80">{t('home.cities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* #cerco Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-cercooffro-primary/10 p-3 rounded-full">
                  <FaSearch className="text-3xl text-cercooffro-primary" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-cercooffro-primary">#cerco</h2>
                  <p className="text-gray-600">{t('home.cercoDescription')}</p>
                </div>
              </div>
              <div className="space-y-4">
                {recentSearchers.map(searcher => (
                  <div key={searcher.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-all hover:border-cercooffro-primary/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="text-cercooffro-primary text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-semibold">{searcher.name}</h3>
                          <FaCheckCircle className="text-cercooffro-primary ml-2 text-sm" />
                        </div>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaUniversity className="mr-1 text-gray-400" />
                          {searcher.university}
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="bg-cercooffro-primary/10 text-cercooffro-primary px-2 py-1 rounded-full text-xs">
                            {searcher.lookingFor}
                          </span>
                          <span className="ml-3 font-medium text-cercooffro-primary">
                            {searcher.budget}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/searchers" 
                className="mt-6 w-full flex items-center justify-center bg-cercooffro-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors"
              >
                {t('home.viewAllSearchers')}
                <FaUsers className="ml-2" />
              </Link>
            </div>

            {/* #offro Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-cercooffro-secondary/10 p-3 rounded-full">
                  <FaHome className="text-3xl text-cercooffro-secondary" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-cercooffro-secondary">#offro</h2>
                  <p className="text-gray-600">{t('home.offroDescription')}</p>
                </div>
              </div>
              <div className="space-y-4">
                {recentListings.map(listing => (
                  <div key={listing.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-all hover:border-cercooffro-secondary/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          width={500}
                          height={300}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center">
                          {listing.title}
                          <FaStar className="text-yellow-400 ml-2" />
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt className="mr-1 text-cercooffro-secondary" />
                          <span>{listing.location}</span>
                        </div>
                        <p className="text-cercooffro-secondary font-medium mt-2 text-lg">
                          {listing.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* add spacer here */}
              <div className="h-16"></div>
              <Link 
                href="/listings" 
                className="mt-6 w-full flex items-center justify-center bg-cercooffro-secondary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors"
              >
                {t('home.viewAllListings')}
                <FaHome className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google AdSense Banner */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=your-client-id"
              crossOrigin="anonymous"
            />
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="your-client-id"
              data-ad-slot="your-ad-slot"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <Script id="adsense-init">
              {`
                (adsbygoogle = window.adsbygoogle || []).push({});
              `}
            </Script>
          </div>
        </div>
      </section>

      {/* Features Section with Improved Design */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.featuresTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('home.featuresSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-cercooffro-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaGraduationCap className="text-2xl text-cercooffro-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.feature1Title')}</h3>
              <p className="text-gray-600">{t('home.feature1Description')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-cercooffro-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-2xl text-cercooffro-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.feature2Title')}</h3>
              <p className="text-gray-600">{t('home.feature2Description')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-cercooffro-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaUsers className="text-2xl text-cercooffro-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.feature3Title')}</h3>
              <p className="text-gray-600">{t('home.feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section with Enhanced Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaHeart className="text-4xl text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">{t('home.openSourceTitle')}</h2>
            <p className="text-gray-600 mb-8 text-lg">{t('home.openSourceDescription')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://github.com/techni-calzone/cercooffro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FaGithub className="mr-2" />
                {t('home.viewOnGithub')}
              </a>
              <button
                className="inline-flex items-center justify-center px-8 py-4 bg-cercooffro-primary text-white rounded-full hover:bg-opacity-90 transition-colors"
              >
                <FaHeart className="mr-2" />
                {t('home.supportProject')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Google AdSense Banner */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="your-client-id"
              data-ad-slot="your-bottom-ad-slot"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <Script id="adsense-init-bottom">
              {`
                (adsbygoogle = window.adsbygoogle || []).push({});
              `}
            </Script>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
