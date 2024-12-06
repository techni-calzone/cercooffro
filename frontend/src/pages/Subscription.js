import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import { Check, Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionPage = () => {
  const { t } = useTranslation();
  const { user, isPremium } = useAuth();

  const handleSubscribe = async () => {
    const stripe = await stripePromise;
    
    // Create checkout session
    const response = await fetch('/api/v1/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        success_url: `${window.location.origin}/subscription/success`,
        cancel_url: `${window.location.origin}/subscription/cancel`,
      }),
    });

    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  const features = {
    free: [
      'search.basic',
      'listings.view',
      'votes.basic',
      'recommendations.limited'
    ],
    premium: [
      'search.advanced',
      'listings.priority',
      'votes.detailed',
      'recommendations.unlimited',
      'alerts.instant',
      'support.priority'
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        {t('subscription.title')}
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        {t('subscription.subtitle')}
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {/* Free Tier */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                {t('subscription.free.title')}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                €0 / {t('subscription.month')}
              </Typography>
              <List>
                {features.free.map((feature) => (
                  <ListItem key={feature}>
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t(`subscription.features.${feature}`)} />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                disabled={true}
                sx={{ mt: 2 }}
              >
                {t('subscription.current_plan')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Tier */}
        <Grid item xs={12} md={6}>
          <Card raised>
            <CardContent>
              <Box sx={{ position: 'relative' }}>
                <Star 
                  sx={{ 
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    color: 'warning.main',
                    fontSize: 40
                  }} 
                />
                <Typography variant="h4" component="h2" gutterBottom>
                  {t('subscription.premium.title')}
                </Typography>
              </Box>
              <Typography variant="h5" color="primary">
                €10 / {t('subscription.month')}
              </Typography>
              <List>
                {features.premium.map((feature) => (
                  <ListItem key={feature}>
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t(`subscription.features.${feature}`)}
                      secondary={t(`subscription.features.${feature}.description`)}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubscribe}
                disabled={isPremium}
                sx={{ mt: 2 }}
              >
                {isPremium 
                  ? t('subscription.current_plan')
                  : t('subscription.upgrade_now')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SubscriptionPage;
