'use client';

import React, { useState, useEffect } from 'react';
import { FaFlag, FaTimes, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

interface ListingReportModalProps {
  listingId: string;
  onClose: () => void;
  initialReason?: string;
}

const ReportReasons = [
  'Expired Listing',
  'Fake or Scam Listing',
  'Not Suitable for Students',
  'Inappropriate Content',
  'Misleading Information',
  'Other'
];

const ListingReportModal: React.FC<ListingReportModalProps> = ({ 
  listingId, 
  onClose, 
  initialReason 
}) => {
  const [selectedReason, setSelectedReason] = useState(initialReason || '');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    // Set initial reason if provided
    if (initialReason) {
      setSelectedReason(initialReason);
    }
  }, [initialReason]);

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      alert('Please select a reason for reporting');
      return;
    }

    try {
      // TODO: Replace with actual API endpoint for reporting
      const response = await fetch('/api/report-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          reason: selectedReason,
          details: additionalDetails
        })
      });

      if (response.ok) {
        // Simulate getting total report count (replace with actual backend logic)
        const mockReportCount = Math.floor(Math.random() * 50) + 1;
        setReportCount(mockReportCount);
        setIsSubmitted(true);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
        <div className="relative bg-white rounded-xl max-w-md w-full p-8 text-center">
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white transition-all"
          >
            <FaTimes className="text-gray-500 hover:text-red-500 transition-colors" />
          </button>

          {/* Success Message */}
          <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Thank You for Reporting
          </h2>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-green-700 font-semibold">
              Your report helps keep our community safe!
            </p>
            <p className="text-gray-600 mt-2">
              This listing has now been flagged {reportCount} times.
            </p>
          </div>

          <p className="text-gray-600 mb-4">
            Our team will review the listing and take appropriate action.
          </p>

          <button 
            onClick={onClose}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl max-w-md w-full p-6">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white transition-all"
        >
          <FaTimes className="text-gray-500 hover:text-red-500 transition-colors" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaShieldAlt className="mr-3 text-blue-500" /> Help Keep Our Community Safe
        </h2>

        {/* Community Impact Message */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center">
          <FaFlag className="text-blue-500 mr-3 text-2xl" />
          <p className="text-blue-700 text-sm">
            Your report helps protect students from potential scams and misleading listings.
          </p>
        </div>

        {/* Reason Dropdown */}
        <div className="mb-4">
          <label htmlFor="report-reason" className="block mb-2 font-semibold">
            Reason for Reporting
          </label>
          <select 
            id="report-reason"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a Reason</option>
            {ReportReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Details */}
        <div className="mb-4">
          <label htmlFor="report-details" className="block mb-2 font-semibold">
            Additional Details (Optional)
          </label>
          <textarea 
            id="report-details"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full p-2 border rounded-lg min-h-[100px]"
            placeholder="Provide more context about your report. Your input helps our community stay safe!"
          />
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmitReport}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <FaFlag className="mr-2" /> Submit Report
        </button>

        {/* Trust and Safety Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          All reports are confidential and reviewed by our community safety team.
        </p>
      </div>
    </div>
  );
};

export default ListingReportModal;
