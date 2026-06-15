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
    return config;
  },
};

export default nextConfig;
