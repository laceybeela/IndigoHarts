/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@indigo-harts/types',
    '@indigo-harts/services',
    '@indigo-harts/hooks',
    '@indigo-harts/ui',
  ],
};

export default nextConfig;
