/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/info',
  assetPrefix: '/info',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
