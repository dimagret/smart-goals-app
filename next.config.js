/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
  // Для SQLite на Vercel нужно указать output standalone
  output: 'standalone',
}

module.exports = nextConfig