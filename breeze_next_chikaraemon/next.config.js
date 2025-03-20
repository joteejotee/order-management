// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // eslintのlint checkをbuild時にoff
    ignoreDuringBuilds: true,
  },
  typescript: {
    // type checkをbuild時にoff
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.order-management1.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
