import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce rapid rebuild churn on Windows (paths with spaces)
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 400,
        ignored: ['**/.next/**', '**/node_modules/**', '**/Project/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
