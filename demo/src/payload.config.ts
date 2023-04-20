import { buildConfig } from 'payload/config';
import path from 'path';
import { LexicalPlugin } from '../../src/index';
//import LexicalPlugin from '../../dist/index'
import Users from './collections/Users';
import Media from './collections/Media';
import RichText from './collections/RichText';
import Lexical from './collections/Lexical';
import LexicalCustomized from './collections/LexicalCustomized';
import LexicalDebug from './collections/LexicalDebug';
import Products from './collections/Products';
import LexicalMinimal from './collections/LexicalMinimal';

export default buildConfig({
  serverURL: 'http://localhost:3001',
  admin: {
    user: Users.slug,
    webpack: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            'react-i18next': path.join(
              __dirname,
              '../node_modules/react-i18next',
            ),
            payload: path.join(__dirname, '../node_modules/payload'),
            '@faceless-ui/modal': path.join(
              __dirname,
              '../node_modules/@faceless-ui/modal',
            ),
          },
        },
      };
    },
  },
  collections: [
    Lexical,
    LexicalCustomized,
    LexicalMinimal,
    LexicalDebug,
    RichText,
    Users,
    Media,
    Products,
  ],
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    LexicalPlugin({
      ai: {
        openai_key: process.env.OPENAI_KEY,
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
