'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

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
    <div ref={dropdownRef} className="w-full p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-cercooffro-primary flex items-center">
          <FaUsers className="mr-2" /> {t('guestsDropdown.who')}
        </h3>
        
        <div className="space-y-6">
          {/* Students */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="font-medium">{t('guestsDropdown.studentsLabel')}</div>
              <div className="text-sm text-gray-600">{t('guestsDropdown.studentsHint')}</div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button 
                onClick={() => handleStudentsChange(-1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                aria-label="Decrease students"
              >
                -
              </button>
              <input 
                type="number" 
                value={students}
                onChange={handleStudentsInput}
                min="1"
                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-2"
                aria-label="Number of students"
              />
              <button 
                onClick={() => handleStudentsChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                aria-label="Increase students"
              >
                +
              </button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="font-medium">{t('guestsDropdown.roomsLabel')}</div>
              <div className="text-sm text-gray-600">{t('guestsDropdown.roomsHint')}</div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button 
                onClick={() => handleRoomsChange(-1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                aria-label="Decrease rooms"
              >
                -
              </button>
              <input 
                type="number" 
                value={rooms}
                onChange={handleRoomsInput}
                min="1"
                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-2"
                aria-label="Number of rooms"
              />
              <button 
                onClick={() => handleRoomsChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                aria-label="Increase rooms"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-cercooffro-primary text-white rounded-lg hover:bg-cercooffro-primary/90 transition-colors"
        >
          {t('common.apply')}
        </button>
      </div>
    </div>
  );
};

export default GuestsDropdown;
