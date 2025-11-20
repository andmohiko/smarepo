/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NEXT_PUBLIC_ENV === 'localhost',
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@web/common'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)