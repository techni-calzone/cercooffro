import ReactGA from 'react-ga4';
import { GOOGLE_ANALYTICS_ID } from './env';

export const initializeAnalytics = () => {
  if (GOOGLE_ANALYTICS_ID && GOOGLE_ANALYTICS_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ 
    hitType: 'pageview', 
    page: path 
  });
};

export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};
