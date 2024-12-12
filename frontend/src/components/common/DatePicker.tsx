import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface DatePickerProps {
  onDateSelect?: (startDate: Date, endDate: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];

    // Add padding for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!selectedStartDate) {
      setSelectedStartDate(selectedDate);
    } else if (!selectedEndDate) {
      if (selectedDate > selectedStartDate) {
        setSelectedEndDate(selectedDate);
        if (onDateSelect) {
          onDateSelect(selectedStartDate, selectedDate);
        }
      } else {
        setSelectedStartDate(selectedDate);
        setSelectedEndDate(null);
      }
    } else {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
    }
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
           (selectedEndDate && date.getTime() === selectedEndDate.getTime());
  };

  const isDateInRange = (day: number) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date > selectedStartDate && date < selectedEndDate;
  };

  const moveMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const days = generateCalendarDays(currentDate);

    return (
      <div className="w-[800px] p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => moveMonth('prev')} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={() => moveMonth('next')} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map(day => (
            <div key={day} className="font-semibold text-gray-500">{day}</div>
          ))}
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`
                ${day === null ? 'bg-transparent' : 'cursor-pointer'}
                ${isDateSelected(day!) ? 'bg-cercooffro-primary text-white' : ''}
                ${isDateInRange(day!) ? 'bg-cercooffro-primary/20' : ''}
                ${day !== null && day < new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'text-gray-300 cursor-not-allowed' : ''}
                p-2 rounded-full hover:bg-gray-100 transition-colors
              `}
              onClick={() => day !== null && day >= new Date().getDate() && handleDateSelect(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl">
      {renderCalendar()}
    </div>
  );
};

export default DatePicker;
