import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { env } from './env'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Faqs } from './collections/Faqs'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Supporters } from './collections/Supporters'
import { AnchorDay } from './globals/AnchorDay'
import { ComingSoon } from './globals/ComingSoon'
import { CookieConsent } from './globals/CookieConsent'
import { DonationSettings } from './globals/DonationSettings'
import { Dropdowns } from './globals/Dropdowns'
import { Footer } from './globals/Footer'
import { Forms } from './globals/Forms'
import { Header } from './globals/Header'
import { Integrations } from './globals/Integrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, News, Partners, Supporters, Faqs, Media, Users],
  globals: [
    Header,
    Footer,
    DonationSettings,
    AnchorDay,
    Dropdowns,
    Integrations,
    Forms,
    CookieConsent,
    ComingSoon,
  ],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: env.S3_BUCKET,
      clientUploads: true,
      config: {
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
      },
    }),
  ],
})
