import { buildConfig } from 'payload/config';
import path from 'path';


export default buildConfig({
  serverURL: 'http://localhost:3001',
  admin: {
  },
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
  ],
});
