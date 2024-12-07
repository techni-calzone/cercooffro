'use client';

import { useState } from 'react';

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form 
        onSubmit={handleSearch} 
        className="max-w-3xl mx-auto mb-8"
      >
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for student housing in Italy..."
            className="w-full px-6 py-4 text-lg rounded-full 
              bg-white border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-cercooffro-primary 
              shadow-google-search hover:shadow-google-hover 
              transition-all duration-300 ease-in-out"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button 
              type="submit" 
              className="bg-cercooffro-primary text-white px-4 py-2 rounded-full 
                hover:bg-opacity-90 transition-colors duration-300
                flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((listing) => (
          <div 
            key={listing} 
            className="bg-white rounded-lg shadow-md overflow-hidden 
              hover:shadow-lg transition-shadow duration-300 
              transform hover:-translate-y-2"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Listing Image</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-cercooffro-primary">
                Listing {listing}
              </h2>
              <p className="text-gray-600 mb-4">
                Spacious student apartment near university campus
              </p>
              <div className="flex justify-between items-center">
                <span className="text-cercooffro-secondary font-bold text-lg">
                  €500/month
                </span>
                <a 
                  href={`/listings/${listing}`} 
                  className="bg-cercooffro-primary text-white px-4 py-2 rounded-full 
                    hover:bg-opacity-90 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
