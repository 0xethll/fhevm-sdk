
// /fhevm-sdk/examples/nextjs/next.config.js

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      wagmi: path.resolve(__dirname, 'node_modules/wagmi'),
      viem: path.resolve(__dirname, 'node_modules/viem'),
      '@tanstack/react-query': path.resolve(
        __dirname,
        'node_modules/@tanstack/react-query',
      ),
    };

    return config;
  },
};

module.exports = nextConfig;