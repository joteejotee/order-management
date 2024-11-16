/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: config => {
    config.resolve.extensions.push('.tsx')
    return config
  },
}

module.exports = nextConfig
