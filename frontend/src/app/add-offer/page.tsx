'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaCheckCircle 
} from 'react-icons/fa';

export default function AddOfferPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    squareMeters: 0,
    monthlyRent: 0,
    utilitiesIncluded: false,
    amenities: [] as string[],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: ''
  });

  // Safely get translation options
  const getTranslationOptions = (key: string): string[] => {
    const options = t(`addOfferPage.${key}`, { returnObjects: true });
    return Array.isArray(options) ? options : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('Submitting offer:', formData);
    alert(t('addOfferPage.submitListing'));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-cercooffro-primary mb-4">
            {t('addOfferPage.title')}
          </h1>
          <p className="text-gray-600">
            {t('addOfferPage.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-cercooffro-primary mb-4 flex items-center">
              <FaHome className="mr-3" /> {t('addOfferPage.propertyDetails')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.propertyType.label')}
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    propertyType: e.target.value
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Property Type</option>
                  {getTranslationOptions('propertyType.options').map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.bedrooms')}
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    bedrooms: parseInt(e.target.value)
                  }))}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.bathrooms')}
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    bathrooms: parseInt(e.target.value)
                  }))}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Square Meters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.squareMeters')}
                </label>
                <input
                  type="number"
                  value={formData.squareMeters}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    squareMeters: parseInt(e.target.value)
                  }))}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.monthlyRent')}
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    monthlyRent: parseInt(e.target.value)
                  }))}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Utilities and Amenities */}
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.utilitiesIncluded}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    utilitiesIncluded: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {t('addOfferPage.utilities')}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addOfferPage.amenities.label')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {getTranslationOptions('amenities.options').map((amenity: string) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-cercooffro-primary mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-3" /> {t('addOfferPage.contactInformation')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    contactName: e.target.value
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Contact Email */}
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
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    contactPhone: e.target.value
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    description: e.target.value
                  }))}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-cercooffro-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center mx-auto"
            >
              <FaCheckCircle className="mr-2" />
              {t('addOfferPage.submitListing')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
