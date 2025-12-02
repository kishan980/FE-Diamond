/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  images: {
    domains: ['ik.imagekit.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: 'http://localhost:3000/',
  },
  experimental: {
    optimizePackageImports: [
      '@date-io/date-fns',
      'date-fns',
      'dayjs',
      'lodash',
      '@types/lodash',
      '@mui/material',
      '@mui/lab',
      '@mui/system',
      '@mui/x-date-pickers',
      '@wandersonalwes/iconsax-react',
      'iconsax-react',
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
