/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sort',
  assetPrefix: '/sort',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
