import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Typography,
  Grid,
  Autocomplete,
  Switch,
  FormControlLabel,
  Collapse,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  TuneRounded,
  LocationOn,
  School,
  Euro,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const cities = [
  'Milano', 'Roma', 'Torino', 'Bologna', 
  'Firenze', 'Napoli', 'Padova', 'Pisa'
];

const universities = {
  'Milano': ['Università degli Studi di Milano', 'Politecnico di Milano'],
  'Roma': ['Sapienza Università di Roma', 'LUISS'],
  'Torino': ['Università degli Studi di Torino', 'Politecnico di Torino'],
  'Bologna': ['Università di Bologna'],
  'Firenze': ['Università degli Studi di Firenze'],
  'Napoli': ['Università degli Studi di Napoli Federico II'],
  'Padova': ['Università degli Studi di Padova'],
  'Pisa': ['Università di Pisa']
};

const amenities = [
  'WiFi', 'Lavatrice', 'Lavastoviglie', 'Aria Condizionata',
  'Riscaldamento', 'Ascensore', 'Balcone', 'Garage'
];

const SearchFilters = ({ onFilterChange, language = 'it' }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    university: '',
    priceRange: [0, 2000],
    size: [0, 200],
    rooms: '',
    amenities: [],
    verifiedOnly: false,
    maxDistance: 5,
    furnished: null,
    availableFrom: null,
    sortBy: 'relevance'
  });

  const [selectedCity, setSelectedCity] = useState('');
  const [availableUniversities, setAvailableUniversities] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      setAvailableUniversities(universities[selectedCity] || []);
    } else {
      setAvailableUniversities([]);
    }
  }, [selectedCity]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCityChange = (event, value) => {
    setSelectedCity(value);
    handleFilterChange('city', value);
    handleFilterChange('university', ''); // Reset university when city changes
  };

  const handleReset = () => {
    setFilters({
      city: '',
      university: '',
      priceRange: [0, 2000],
      size: [0, 200],
      rooms: '',
      amenities: [],
      verifiedOnly: false,
      maxDistance: 5,
      furnished: null,
      availableFrom: null,
      sortBy: 'relevance'
    });
    setSelectedCity('');
    onFilterChange({});
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          {language === 'it' ? 'Filtri di Ricerca' : 'Search Filters'}
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={3}>
          {/* Location Filters */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={selectedCity}
              onChange={handleCityChange}
              options={cities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={language === 'it' ? 'Città' : 'City'}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                value={filters.university}
                onChange={(event, value) => handleFilterChange('university', value)}
                options={availableUniversities}
                disabled={!selectedCity}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={language === 'it' ? 'Università' : 'University'}
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Price Range */}
          <Grid item xs={12}>
            <Typography gutterBottom>
              {language === 'it' ? 'Prezzo mensile (€)' : 'Monthly Price (€)'}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(event, value) => handleFilterChange('priceRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
            />
          </Grid>

          {/* Size Range */}
          <Grid item xs={12}>
            <Typography gutterBottom>
              {language === 'it' ? 'Dimensione (m²)' : 'Size (m²)'}
            </Typography>
            <Slider
              value={filters.size}
              onChange={(event, value) => handleFilterChange('size', value)}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              step={10}
            />
          </Grid>

          {/* Rooms */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                {language === 'it' ? 'Numero di stanze' : 'Number of rooms'}
              </InputLabel>
              <Select
                value={filters.rooms}
                onChange={(e) => handleFilterChange('rooms', e.target.value)}
                label={language === 'it' ? 'Numero di stanze' : 'Number of rooms'}
              >
                <MenuItem value="">
                  {language === 'it' ? 'Qualsiasi' : 'Any'}
                </MenuItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
                <MenuItem value="6+">6+</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <Typography gutterBottom>
              {language === 'it' ? 'Servizi' : 'Amenities'}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => {
                    const newAmenities = filters.amenities.includes(amenity)
                      ? filters.amenities.filter(a => a !== amenity)
                      : [...filters.amenities, amenity];
                    handleFilterChange('amenities', newAmenities);
                  }}
                  color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
                  variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          {/* Additional Filters */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                />
              }
              label={language === 'it' ? 'Solo annunci verificati' : 'Verified listings only'}
            />
          </Grid>

          {/* Sort Options */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                {language === 'it' ? 'Ordina per' : 'Sort by'}
              </InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label={language === 'it' ? 'Ordina per' : 'Sort by'}
              >
                <MenuItem value="relevance">
                  {language === 'it' ? 'Rilevanza' : 'Relevance'}
                </MenuItem>
                <MenuItem value="price_asc">
                  {language === 'it' ? 'Prezzo (crescente)' : 'Price (lowest first)'}
                </MenuItem>
                <MenuItem value="price_desc">
                  {language === 'it' ? 'Prezzo (decrescente)' : 'Price (highest first)'}
                </MenuItem>
                <MenuItem value="date">
                  {language === 'it' ? 'Data di pubblicazione' : 'Date posted'}
                </MenuItem>
                <MenuItem value="size">
                  {language === 'it' ? 'Dimensione' : 'Size'}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleReset}>
                {language === 'it' ? 'Reimposta' : 'Reset'}
              </Button>
              <Button
                variant="contained"
                onClick={() => onFilterChange(filters)}
                startIcon={<TuneRounded />}
              >
                {language === 'it' ? 'Applica Filtri' : 'Apply Filters'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default SearchFilters;
