export interface AdConfig {
  clientId: string;
  adSlots: {
    homePageBanner: string;
    sidebarAd: string;
    listingPageAd: string;
  };
}

export const adsenseConfig: AdConfig = {
  // Replace with your actual Google AdSense client ID
  clientId: 'pub-7508445426374362',
  adSlots: {
    homePageBanner: '5270099041', // Replace with your actual AdSense slot ID
    sidebarAd: 'sidebar_slot_id',
    listingPageAd: 'listing_page_slot_id'
  }
};

// Enhanced anti-adblock configuration
export const antiAdblockConfig = {
  // Obfuscation techniques
  adClassNames: [
    'sponsored-content',
    'site-support-ad',
    'content-sponsor'
  ],
  
  // Fallback content strategies
  fallbackStrategies: [
    {
      type: 'message',
      content: 'Support our platform by disabling your ad blocker'
    },
    {
      type: 'donation',
      link: '/support'
    }
  ],
  
  // Tracking and analytics for ad block events
  trackingConfig: {
    enabled: true,
    endpoint: '/api/adblock-analytics',
    events: [
      'block_detected',
      'block_bypassed',
      'support_action'
    ]
  },
  
  // Sophisticated detection methods
  detectionMethods: {
    checkAdElementHeight: true,
    checkGlobalAdsbygoogle: true,
    checkNetworkRequests: true
  }
};

// AdSense best practices configuration
export const adsenseOptions = {
  // Enable lazy loading for improved performance
  lazyLoad: true,
  
  // Responsive ad sizes
  responsiveSizes: [
    { width: 728, height: 90 },   // Leaderboard
    { width: 300, height: 250 },  // Medium Rectangle
    { width: 160, height: 600 },  // Wide Skyscraper
  ],

  // Placement guidelines
  placementRules: {
    minContentHeight: 1000,  // Minimum page height for ads
    maxAdsPerPage: 3,        // Maximum number of ads per page
    adSpacing: 500,          // Minimum pixels between ads
  }
};
