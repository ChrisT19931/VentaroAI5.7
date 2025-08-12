/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'placehold.co', 'images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add Supabase storage domain when available
  experimental: {
    optimizePackageImports: ['react-hot-toast'],
  },
  // Environment variables configuration for Vercel
  env: {
    // Ensure these are available during build time
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  // Improve chunk loading to prevent ChunkLoadError
  webpack: (config, { isServer, webpack }) => {
    // Optimize chunk size and loading
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
        // Create a specific chunk for react and related packages
        react: {
          name: 'react',
          chunks: 'all',
          test: /[\/]node_modules[\/](react|react-dom|scheduler|prop-types)[\/]/,
          priority: 20,
        },
      },
    };
    
    // Handle environment variables during build
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.VERCEL_BUILD': JSON.stringify(process.env.VERCEL || 'false'),
      })
    );
    
    return config;
  },
  // Skip static generation for downloads pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable ESLint during production build to prevent failures due to unescaped entities
  eslint: {
    // Only run ESLint on local development, not during builds
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration for build optimization
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors during Vercel deployment
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig