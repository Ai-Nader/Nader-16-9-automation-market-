/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable server components since we're using static export
  experimental: {
    appDir: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
  // Disable image optimization since we're using static export
  optimizeFonts: false,
  // Disable SWC minifier to use Terser instead
  swcMinify: false,
  // Use Webpack for compilation
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  },
}

module.exports = nextConfig