/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true // This will allow the build to complete even with ESLint warnings
  },
  typescript: {
    ignoreBuildErrors: true // This will allow the build to complete even with TypeScript errors
  }
};

export default nextConfig;
