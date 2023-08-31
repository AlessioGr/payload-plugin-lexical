import { mongooseAdapter } from '@payloadcms/db-mongodb'


export const adapter = mongooseAdapter({
    url: 'mongodb://127.0.0.1/payload',
  });