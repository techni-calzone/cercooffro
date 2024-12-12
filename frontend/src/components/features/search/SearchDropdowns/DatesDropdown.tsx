'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DatesDropdownProps {
  onSelect: (dates: { startDate: Date; endDate: Date }) => void;
  onClose: () => void;
}

const DatesDropdown = ({ 
  onSelect, 
  onClose 
}: DatesDropdownProps) => {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleApply = () => {
    if (startDate && endDate) {
      onSelect({ startDate, endDate });
      onClose();
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-20 top-full mt-2 bg-white rounded-xl shadow-lg p-4"
    >
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('datesDropdown.checkInLabel')}
          </label>
          <input
            type="date"
            value={startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cercooffro-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('datesDropdown.checkOutLabel')}
          </label>
          <input
            type="date"
            value={endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            min={startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cercooffro-primary"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          {t('datesDropdown.cancel')}
        </button>
        <button
          onClick={handleApply}
          disabled={!startDate || !endDate}
          className={`
            px-3 py-1 text-sm rounded-lg
            ${startDate && endDate
              ? 'bg-cercooffro-primary text-white hover:bg-cercooffro-primary/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {t('datesDropdown.apply')}
        </button>
      </div>
    </div>
  );
};

export default DatesDropdown;
