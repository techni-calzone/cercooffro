/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',  // Allow all paths under images.unsplash.com
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cercooffro.it.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'technicalz.one',
        port: '',
        pathname: '**',
      },
    ],
  },
  // Add script for Google AdSense and Telegram
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://telegram.org https://ep2.adtrafficquality.google;",
          },
        ],
      },
    ];
  },

  // Add external scripts
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;