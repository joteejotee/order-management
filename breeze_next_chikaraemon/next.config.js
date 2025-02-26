// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true, // 削除：Next.js 15では非推奨
  },
  eslint: {
    // eslintのlint checkをbuild時にoff
    ignoreDuringBuilds: true,
  },
  typescript: {
    // type checkをbuild時にoff
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
