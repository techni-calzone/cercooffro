import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import SearchFilters from '../components/SearchFilters';
import ListingCard from '../components/ListingCard';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Listings = () => {
  const { t } = useTranslation();
  const { isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchParams, setSearchParams] = useState({});

  // Query for regular listings search
  const {
    data: listings,
    isLoading: isLoadingListings,
    error: listingsError,
    refetch: refetchListings
  } = useQuery(
    ['listings', searchParams],
    () => listingsAPI.search(searchParams),
    { enabled: activeTab === 0 }
  );

  // Query for recommendations (premium feature)
  const {
    data: recommendations,
    isLoading: isLoadingRecommendations,
    error: recommendationsError
  } = useQuery(
    'recommendations',
    listingsAPI.getRecommendations,
    { enabled: isPremium && activeTab === 1 }
  );

  const handleSearch = (filters) => {
    setSearchParams(filters);
    refetchListings();
  };

  const handleVote = async (listingId, status) => {
    try {
      await listingsAPI.voteListing(listingId, status);
      refetchListings();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const renderContent = () => {
    if (activeTab === 0) {
      if (isLoadingListings) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        );
      }

      if (listingsError) {
        return (
          <Alert severity="error" sx={{ mt: 4 }}>
            {t('errors.search_failed')}
          </Alert>
        );
      }

      if (!listings?.length) {
        return (
          <Alert severity="info" sx={{ mt: 4 }}>
            {t('listings.no_results')}
          </Alert>
        );
      }

      return (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard listing={listing} onVote={handleVote} />
            </Grid>
          ))}
        </Grid>
      );
    }

    // Recommendations tab
    if (!isPremium) {
      return (
        <Alert severity="info" sx={{ mt: 4 }}>
          {t('recommendations.premium_only')}
        </Alert>
      );
    }

    if (isLoadingRecommendations) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (recommendationsError) {
      return (
        <Alert severity="error" sx={{ mt: 4 }}>
          {t('errors.recommendations_failed')}
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {recommendations?.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <ListingCard listing={listing} onVote={handleVote} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('listings.title')}
      </Typography>

      <SearchFilters onSearch={handleSearch} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="listing tabs"
        >
          <Tab label={t('listings.search_results')} />
          <Tab 
            label={t('listings.recommendations')} 
            disabled={!isPremium}
          />
        </Tabs>
      </Box>

      {renderContent()}
    </Container>
  );
};

export default Listings;
