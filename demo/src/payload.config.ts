import { buildConfig } from 'payload/config';
import path from 'path';
// import seo from '../../dist';
import lexical from '../../src';
import Users from './collections/Users';
import Lexical from './collections/Lexical';
import Media from './collections/Media';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: (config) => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            react: path.join(__dirname, "../node_modules/react"),
            "react-dom": path.join(__dirname, "../node_modules/react-dom"),
            "payload": path.join(__dirname, "../node_modules/payload"),
          },
        },
      };

      return newConfig;
    },
  },
  collections: [
    Users,
    Lexical,
    Media
  ],
  localization: {
    locales: [
      'en',
      'es',
      'de',
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    lexical({}),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
});
