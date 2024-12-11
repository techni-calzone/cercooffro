import { useState, useCallback } from 'react';

export type SearchDropdownType = 'location' | 'dates' | 'guests' | 'filter' | null;

export interface SearchParams {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  students: number;
  rooms: number;
}

export const useNavBar = () => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isDatesDropdownOpen, setIsDatesDropdownOpen] = useState(false);
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [location, setLocation] = useState('');
  const [dates, setDates] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [guests, setGuests] = useState({ students: 1, rooms: 1 });
  const [filters, setFilters] = useState({});

  const toggleLocationDropdown = useCallback((open?: boolean) => {
    setIsLocationDropdownOpen(prev => open ?? !prev);
    // Close other dropdowns
    setIsDatesDropdownOpen(false);
    setIsGuestsDropdownOpen(false);
    setIsFilterDropdownOpen(false);
  }, []);

  const toggleDatesDropdown = useCallback((open?: boolean) => {
    setIsDatesDropdownOpen(prev => open ?? !prev);
    // Close other dropdowns
    setIsLocationDropdownOpen(false);
    setIsGuestsDropdownOpen(false);
    setIsFilterDropdownOpen(false);
  }, []);

  const toggleGuestsDropdown = useCallback((open?: boolean) => {
    setIsGuestsDropdownOpen(prev => open ?? !prev);
    // Close other dropdowns
    setIsLocationDropdownOpen(false);
    setIsDatesDropdownOpen(false);
    setIsFilterDropdownOpen(false);
  }, []);

  const toggleFilterDropdown = useCallback((open?: boolean) => {
    setIsFilterDropdownOpen(prev => open ?? !prev);
    // Close other dropdowns
    setIsLocationDropdownOpen(false);
    setIsDatesDropdownOpen(false);
    setIsGuestsDropdownOpen(false);
  }, []);

  const toggleSearchModal = useCallback((open?: boolean) => {
    setIsSearchModalOpen(prev => open ?? !prev);
  }, []);

  const handleLocationSelect = useCallback((selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLocationDropdownOpen(false);
  }, []);

  const handleDatesSelect = useCallback((selectedDates: { startDate: Date; endDate: Date }) => {
    setDates(selectedDates);
    setIsDatesDropdownOpen(false);
  }, []);

  const handleGuestsSelect = useCallback((selectedGuests: { students: number; rooms: number }) => {
    setGuests(selectedGuests);
    setIsGuestsDropdownOpen(false);
  }, []);

  const handleFilterSelect = useCallback((selectedFilters: any) => {
    setFilters(selectedFilters);
    setIsFilterDropdownOpen(false);
  }, []);

  const handleSearch = useCallback(() => {
    // Implement search logic here
    console.log('Searching with params:', { 
      location, 
      ...dates, 
      ...guests, 
      filters 
    });
    // Close all dropdowns and search modal
    setIsLocationDropdownOpen(false);
    setIsDatesDropdownOpen(false);
    setIsGuestsDropdownOpen(false);
    setIsFilterDropdownOpen(false);
    setIsSearchModalOpen(false);
  }, [
    location, 
    dates, 
    guests, 
    filters
  ]);

  return {
    isLocationDropdownOpen,
    setIsLocationDropdownOpen,
    isDatesDropdownOpen,
    setIsDatesDropdownOpen,
    isGuestsDropdownOpen,
    setIsGuestsDropdownOpen,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    location,
    dates,
    guests,
    filters,
    toggleLocationDropdown,
    toggleDatesDropdown,
    toggleGuestsDropdown,
    toggleFilterDropdown,
    toggleSearchModal,
    handleLocationSelect,
    handleDatesSelect,
    handleGuestsSelect,
    handleFilterSelect,
    handleSearch
  };
};
