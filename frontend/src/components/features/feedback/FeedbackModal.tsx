'use client';

import React from 'react';
import { 
  FaCommentDots, 
  FaBug, 
  FaGithub 
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { EXTERNAL_LINKS, type SupportedLanguages } from '@/config/links';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const feedbackOptions = [
    {
      title: t('feedbackModal.generalFeedback'),
      description: t('feedbackModal.generalFeedbackDescription'),
      icon: FaCommentDots,
      link: EXTERNAL_LINKS.FEEDBACK.GENERAL_FEEDBACK[language as SupportedLanguages] || 
            EXTERNAL_LINKS.FEEDBACK.GENERAL_FEEDBACK.en
    },
    {
      title: t('feedbackModal.reportBug'),
      description: t('feedbackModal.reportBugDescription'),
      icon: FaBug,
      link: EXTERNAL_LINKS.FEEDBACK.REPORT_BUG.DEFAULT
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-cercooffro-primary mb-4 text-center">
          {t('feedbackModal.title')}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {t('feedbackModal.subtitle')}
        </p>

        <div className="space-y-4">
          {feedbackOptions.map((option) => (
            <a
              key={option.title}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center">
                <option.icon 
                  className="text-3xl mr-4 text-cercooffro-primary group-hover:scale-110 transition-transform" 
                />
                <div>
                  <h3 className="font-semibold text-lg text-cercooffro-primary">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-gray-500 hover:text-cercooffro-primary transition-colors"
        >
          {t('feedbackModal.cancel')}
        </button>
      </div>
    </div>
  );
}
