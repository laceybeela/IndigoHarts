import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@indigo-harts/types',
    '@indigo-harts/services',
    '@indigo-harts/hooks',
    '@indigo-harts/ui',
    '@indigo-harts/config',
  ],
  webpack: (config) => {
    // Workaround for Node 23 + webpack 5.90 "Unexpected end of JSON input"
    config.optimization.concatenateModules = false;

    const webReact = path.resolve(__dirname, 'node_modules/react');
    const webReactDom = path.resolve(__dirname, 'node_modules/react-dom');
    const webReactQuery = path.resolve(
      __dirname,
      'node_modules/@tanstack/react-query'
    );

    // Deduplicate @tanstack/react-query globally so all packages share
    // the same QueryClient context.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tanstack/react-query': webReactQuery,
    };

    // Force workspace packages (packages/*) to use the web app's React so
    // they share the same context instances. Applied per-rule via `include`
    // so Next.js internals (which need a special RSC React build) are not
    // affected.
    config.module.rules.push({
      test: /\.[tj]sx?$/,
      include: [path.resolve(__dirname, '../../packages')],
      resolve: {
        alias: {
          react: webReact,
          'react-dom': webReactDom,
        },
      },
    });

    return config;
  },
};

export default nextConfig;
