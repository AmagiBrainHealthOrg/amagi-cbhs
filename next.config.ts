import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // The PLADRR form is the CMS page `pladrr-express-interest`, served under /pladrr.
  async rewrites() {
    return [{ source: '/pladrr/express-interest', destination: '/pladrr-express-interest' }]
  },
  async redirects() {
    return [
      {
        source: '/pladrr-express-interest',
        destination: '/pladrr/express-interest',
        permanent: false,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
