'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  const footerLinks = {
    it: [
      { href: "/privacy", text: "Politica sulla Privacy" },
      { href: "/terms", text: "Termini di Servizio" },
      { href: "/contact", text: "Contattaci" }
    ],
    en: [
      { href: "/privacy", text: "Privacy Policy" },
      { href: "/terms", text: "Terms of Service" },
      { href: "/contact", text: "Contact Us" }
    ]
  };

  return (
    <footer className="bg-white/90 backdrop-blur-md py-12 mt-12 border-t border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🏠</span>
              <h2 className="text-2xl font-bold text-cercooffro-primary">
                CercoOffro
              </h2>
            </div>
            <p className="text-gray-800 font-normal text-base">
              {language === 'it' 
                ? "Trova la tua casa perfetta per gli studenti in Italia" 
                : "Find your perfect student home in Italy"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cercooffro-primary">
              {language === 'it' ? "Link Veloci" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/listings" className="text-gray-800 hover:text-cercooffro-secondary transition-colors font-medium text-base">
                  {t('listings')}
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-gray-800 hover:text-cercooffro-secondary transition-colors font-medium text-base">
                  {t('addListing')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-800 hover:text-cercooffro-secondary transition-colors font-medium text-base">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cercooffro-primary">
              {language === 'it' ? "Legale" : "Legal"}
            </h3>
            <ul className="space-y-2">
              {footerLinks[language].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-800 hover:text-cercooffro-secondary transition-colors font-medium text-base">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-700 font-medium text-base">
            &copy; {new Date().getFullYear()} CercoOffro. 
            {language === 'it' 
              ? " Tutti i diritti riservati." 
              : " All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
