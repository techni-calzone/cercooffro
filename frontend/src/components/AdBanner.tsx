import React from 'react';
import { adsenseConfig } from '@/config/adsense';

interface AdBannerProps {
  slot?: keyof typeof adsenseConfig.adSlots;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot = 'homePageBanner' }) => {
  return (
    <div className="ad-container">
      {/* Ad implementation will go here */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseConfig.clientId}
        data-ad-slot={adsenseConfig.adSlots[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
