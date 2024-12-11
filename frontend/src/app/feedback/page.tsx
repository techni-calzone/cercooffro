'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  FaCommentDots, 
  FaStar, 
  FaCheckCircle 
} from 'react-icons/fa';

export default function FeedbackPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    experienceType: '',
    satisfactionLevel: '',
    feedbackDetails: '',
    contactPermission: false,
    contactEmail: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Safely get translation options
  const getTranslationOptions = (key: string): string[] => {
    const options = t(`feedbackPage.${key}`, { returnObjects: true });
    return Array.isArray(options) ? options : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('Submitting feedback:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cercooffro-primary mb-4">
            Thank You!
          </h2>
          <p className="text-gray-600 mb-6">
            {t('feedbackPage.thankYouMessage')}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-cercooffro-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-cercooffro-primary mb-4 flex items-center justify-center">
            <FaCommentDots className="mr-3" /> {t('feedbackPage.title')}
          </h1>
          <p className="text-gray-600">
            {t('feedbackPage.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Experience Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('feedbackPage.experienceType.label')}
            </label>
            <select
              value={formData.experienceType}
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                experienceType: e.target.value
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Experience Type</option>
              {getTranslationOptions('experienceType.options').map((type: string) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Satisfaction Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('feedbackPage.satisfactionLevel.label')}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {getTranslationOptions('satisfactionLevel.options').map((level: string) => (
                <label 
                  key={level} 
                  className={`
                    flex flex-col items-center justify-center 
                    p-2 border rounded-md cursor-pointer 
                    transition-colors
                    ${formData.satisfactionLevel === level 
                      ? 'bg-cercooffro-primary/10 border-cercooffro-primary' 
                      : 'border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={level}
                    checked={formData.satisfactionLevel === level}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      satisfactionLevel: e.target.value
                    }))}
                    className="hidden"
                  />
                  <FaStar className={`mb-1 ${
                    formData.satisfactionLevel === level 
                      ? 'text-cercooffro-primary' 
                      : 'text-gray-300'
                  }`} />
                  {level}
                </label>
              ))}
            </div>
          </div>

          {/* Feedback Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('feedbackPage.feedbackDetails')}
            </label>
            <textarea
              value={formData.feedbackDetails}
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                feedbackDetails: e.target.value
              }))}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Share your detailed feedback..."
              required
            />
          </div>

          {/* Contact Permission */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.contactPermission}
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                contactPermission: e.target.checked
              }))}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              {t('feedbackPage.contactPermission')}
            </label>
          </div>

          {/* Contact Email (if permission is given) */}
          {formData.contactPermission && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({
                  ...prev, 
                  contactEmail: e.target.value
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your email for follow-up"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-cercooffro-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center mx-auto"
            >
              <FaCommentDots className="mr-2" />
              {t('feedbackPage.submitFeedback')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
