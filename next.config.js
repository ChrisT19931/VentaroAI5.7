/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Add Supabase storage domain when available
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip static generation for downloads pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig