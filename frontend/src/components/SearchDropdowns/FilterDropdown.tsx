import React, { useState } from 'react';

interface FilterDropdownProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  // ... other filter states (e.g., amenities, room type, etc.)

  const handleApply = () => {
    onApply({ priceRange /* ... other filter values */ });
    onClose();
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-lg p-4 min-w-[250px]">
      <h3 className="text-lg font-medium mb-2">Filters</h3>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label htmlFor="price-range" className="block mb-1">Price Range:</label>
        {/* Use a range slider or input fields for price range selection */}
        {/* Example using a simple range input (replace with a better component) */}
        <input
          type="range"
          id="price-range"
          min="0"
          max="1000"
          value={priceRange[1]} // Assuming a single value for simplicity
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
        />
      </div>

      {/* ... other filter options ... */}

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-cercooffro-primary text-white rounded-md hover:bg-cercooffro-primary/90 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;