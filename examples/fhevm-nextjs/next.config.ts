import type { NextConfig } from "next";

import path from "path"

const nextConfig: NextConfig = {
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
        '@fhevm/core': path.resolve(__dirname, 'node_modules/@fhevm/core'),
        '@fhevm/react': path.resolve(__dirname, 'node_modules/@fhevm/react'),
      };

      return config;

    },
};

export default nextConfig;
