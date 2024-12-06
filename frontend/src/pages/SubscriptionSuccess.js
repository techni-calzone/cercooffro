import React, { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SubscriptionSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { upgradeToPremium } = useAuth();

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        await upgradeToPremium();
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    };
    updateSubscription();
  }, [upgradeToPremium]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {t('subscription.success.title')}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {t('subscription.success.message')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/listings')}
          sx={{ mt: 2 }}
        >
          {t('subscription.success.start_browsing')}
        </Button>
      </Box>
    </Container>
  );
};

export default SubscriptionSuccess;
