import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
