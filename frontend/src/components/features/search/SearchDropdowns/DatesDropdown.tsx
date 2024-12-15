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
    <div ref={dropdownRef} className="w-full p-4">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('datesDropdown.checkInLabel')}
          </label>
          <input
            type="date"
            value={startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cercooffro-primary"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('datesDropdown.checkOutLabel')}
          </label>
          <input
            type="date"
            value={endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            min={startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cercooffro-primary"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-3 border-t border-gray-200 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {t('datesDropdown.cancel')}
        </button>
        <button
          onClick={handleApply}
          disabled={!startDate || !endDate}
          className={`
            px-6 py-2 text-sm rounded-lg transition-colors
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
