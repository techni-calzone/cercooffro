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
    ],
  },
  // Add metadata base for social sharing and image resolution
  metadataBase: new URL('https://www.cercooffro.com'),
};

module.exports = nextConfig;
