'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaTimes, FaFlag, FaExclamationTriangle, FaPhone, FaEnvelope, FaWhatsapp, FaBed, FaBath, FaRulerCombined, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Listing } from './ListingCard';
import Link from 'next/link';
import ListingReportModal from './ListingReportModal';

interface ListingDetailsModalProps {
  listing: Listing;
  onClose: () => void;
}

// Mock contact generation (replace with actual backend logic)
const generateMockContacts = (listingId: string) => {
  const mockContacts = {
    phone: `+39 ${Math.floor(Math.random() * 900000000) + 100000000}`,
    email: `contact_${listingId}@example.com`,
    whatsapp: `+39 ${Math.floor(Math.random() * 900000000) + 100000000}`
  };
  return mockContacts;
};

// Mock additional listing details (to be replaced with actual data)
const generateMockListingDetails = () => {
  return {
    bedrooms: Math.floor(Math.random() * 3) + 1,
    bathrooms: Math.floor(Math.random() * 2) + 1,
    squareMeters: Math.floor(Math.random() * 50) + 30,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
    nunc eget ultricies tincidunt, velit velit bibendum velit, vel bibendum velit velit sit amet velit. 
    Donec euismod, nisl eget ultricies tincidunt, velit velit bibendum velit, vel bibendum velit velit sit amet velit. 
    Praesent euismod, nisl eget ultricies tincidunt, velit velit bibendum velit, vel bibendum velit velit sit amet velit.
    
    Additional details about the property, its location, and unique features. This is a placeholder text 
    that would be replaced with actual property description in a real-world scenario.`,
    additionalAmenities: [
      'Washing Machine',
      'Air Conditioning',
      'Heating',
      'Balcony',
      'Elevator',
      'Parking Space'
    ]
  };
};

const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({ listing, onClose }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportType, setReportType] = useState<'expired' | 'other' | null>(null);
  const [contacts, setContacts] = useState<{phone: string, email: string, whatsapp: string} | null>(null);
  const [listingDetails] = useState(generateMockListingDetails());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(listing.images) ? listing.images : [listing.images];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleGetContacts = () => {
    // In a real app, this would be an API call
    const generatedContacts = generateMockContacts(listing.id);
    setContacts(generatedContacts);
  };

  const handleOpenReportModal = (type: 'expired' | 'other') => {
    setReportType(type);
    setIsReporting(true);
  };

  const handleCloseReportModal = () => {
    setIsReporting(false);
    setReportType(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-xl transform transition-all mt-16">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Slider */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
              {images.length > 0 && (
                <div className="relative w-full h-full">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${listing.title} - ${currentImageIndex + 1}/${images.length}`}
                    fill
                    className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              
              {images.length > 1 && (
                <>
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Previous"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    aria-label="Next"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-6 overflow-y-auto md:max-h-[80vh]">
              <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{listingDetails.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">€{listing.price}/month</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{listing.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Availability</p>
                      <p className="font-medium">{listing.availability}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{listing.type}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {listing.amenities?.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-cercooffro-primary rounded-full"></span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Amenities</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities.map((amenity, index) => (
                      <span 
                        key={index} 
                        className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Additional Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listingDetails.additionalAmenities.map((amenity, index) => (
                      <span 
                        key={index} 
                        className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {!contacts ? (
                    <button 
                      onClick={handleGetContacts}
                      className="w-full bg-cercooffro-primary text-white py-3 rounded-lg hover:bg-cercooffro-primary/90 transition-colors"
                    >
                      Get Contacts
                    </button>
                  ) : (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaPhone className="mr-3 text-green-600" />
                          <a 
                            href={`tel:${contacts.phone}`} 
                            className="text-green-800 hover:underline"
                          >
                            {contacts.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-3 text-blue-600" />
                          <a 
                            href={`mailto:${contacts.email}`} 
                            className="text-blue-800 hover:underline"
                          >
                            {contacts.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <FaWhatsapp className="mr-3 text-green-500" />
                          <a 
                            href={`https://wa.me/${contacts.whatsapp.replace(/\s/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-800 hover:underline"
                          >
                            {contacts.whatsapp}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex items-center mb-3">
                    <FaExclamationTriangle className="text-yellow-600 mr-3 text-2xl" />
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Is Something Wrong with this Listing?
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleOpenReportModal('expired')}
                      className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center"
                    >
                      <FaFlag className="mr-2" /> Listing Expired
                    </button>
                    
                    <button 
                      onClick={() => handleOpenReportModal('other')}
                      className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center"
                    >
                      <FaExclamationTriangle className="mr-2" /> Other Issue
                    </button>
                  </div>
                  
                  <p className="text-xs text-yellow-600 mt-2 text-center">
                    Help us keep our listings accurate and trustworthy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Modal */}
      {isReporting && (
        <ListingReportModal 
          listingId={listing.id} 
          onClose={handleCloseReportModal}
          initialReason={reportType === 'expired' ? 'Expired Listing' : undefined}
        />
      )}
    </div>
  );
};

export default ListingDetailsModal;
