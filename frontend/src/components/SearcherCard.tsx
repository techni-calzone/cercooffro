'use client';

import React from 'react';
import { FaUniversity, FaMoneyBillWave, FaCalendarAlt, FaTags } from 'react-icons/fa';

export interface Searcher {
  id: string;
  name: string;
  university: string;
  studyField: string;
  budget: number;
  moveInDate: string;
  tags: string[];
}

interface SearcherCardProps {
  searcher: Searcher;
  onClick?: () => void;
}

export default function SearcherCard({ searcher, onClick }: SearcherCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-cercooffro-primary">{searcher.name}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {searcher.studyField}
        </span>
      </div>

      <div className="space-y-2 text-gray-700">
        <div className="flex items-center">
          <FaUniversity className="mr-2 text-cercooffro-primary" />
          <span>{searcher.university}</span>
        </div>
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-2 text-cercooffro-primary" />
          <span>€{searcher.budget}/month</span>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-cercooffro-primary" />
          <span>{searcher.moveInDate}</span>
        </div>
        <div className="flex items-center">
          <FaTags className="mr-2 text-cercooffro-primary" />
          <div className="flex flex-wrap gap-1">
            {searcher.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-cercooffro-primary/10 text-cercooffro-primary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
