'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

interface GuestsDropdownProps {
  onSelect: (guests: { students: number; rooms: number }) => void;
  onClose: () => void;
  initialGuests?: { students: number; rooms: number };
  className?: string;
}

const GuestsDropdown = ({ 
  onSelect, 
  onClose, 
  initialGuests = { students: 1, rooms: 1 },
  className = ''
}: GuestsDropdownProps) => {
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [students, setStudents] = useState(initialGuests.students);
  const [rooms, setRooms] = useState(initialGuests.rooms);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Removed automatic onClose() call
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStudentsChange = (delta: number) => {
    const newStudents = Math.max(1, students + delta);
    setStudents(newStudents);
    onSelect({ students: newStudents, rooms });
  };

  const handleRoomsChange = (delta: number) => {
    const newRooms = Math.max(1, rooms + delta);
    setRooms(newRooms);
    onSelect({ students, rooms: newRooms });
  };

  const handleStudentsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const newStudents = isNaN(value) || value < 1 ? 1 : value;
    setStudents(newStudents);
    onSelect({ students: newStudents, rooms });
  };

  const handleRoomsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const newRooms = isNaN(value) || value < 1 ? 1 : value;
    setRooms(newRooms);
    onSelect({ students, rooms: newRooms });
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-cercooffro-primary flex items-center">
          <FaUsers className="mr-2" /> {t('guestsDropdown.who')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{t('guestsDropdown.studentsLabel')}</div>
              <div className="text-sm text-gray-600">{t('guestsDropdown.studentsHint')}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleStudentsChange(-1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <input 
                type="number" 
                value={students}
                onChange={handleStudentsInput}
                min="1"
                className="w-12 text-center border border-gray-300 rounded px-2 py-1"
              />
              <button 
                onClick={() => handleStudentsChange(1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{t('guestsDropdown.roomsLabel')}</div>
              <div className="text-sm text-gray-600">{t('guestsDropdown.roomsHint')}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleRoomsChange(-1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <input 
                type="number" 
                value={rooms}
                onChange={handleRoomsInput}
                min="1"
                className="w-12 text-center border border-gray-300 rounded px-2 py-1"
              />
              <button 
                onClick={() => handleRoomsChange(1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestsDropdown;
