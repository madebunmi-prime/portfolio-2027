import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export → deploy the `out/` folder to Cloudflare Pages, Netlify, GitHub Pages, etc.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ['three'],
};

export default nextConfig;
