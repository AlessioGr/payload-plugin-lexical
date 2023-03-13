import { buildConfig } from 'payload/config';
import path from 'path';
//import LexicalPlugin from '../../src/index'
//import LexicalPlugin from '../../dist/index'

import Users from './collections/Users';
import Media from './collections/Media';
import RichText from './collections/RichText';
import LexicalCustomized from './collections/LexicalCustomized';
const mockModulePath = path.resolve(__dirname, 'mocks/emptyObject.js');
import customizedLexicalRichText from "./fields/customizedLexicalRichTextField";
const testy = path.resolve(__dirname, '../../node_modules/lib0/environment.js');

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: (config) => {
      const newConfig = {
        ...config,
        // mix.options({
        // 	legacyNodePolyfills: false
        // });
        resolve: {
          ...config.resolve,
          fullySpecified: false,
          aliasFields: ['process/browser'],
          alias: {
            ...config.resolve.alias,
            react: path.join(__dirname, "../node_modules/react"),
            "react-dom": path.join(__dirname, "../node_modules/react-dom"),
            "payload": path.join(__dirname, "../node_modules/payload"),
            '@faceless-ui/modal': path.join(__dirname, '../node_modules/@faceless-ui/modal'),
            /*[testy]: mockModulePath,
            'lib0': mockModulePath,
            'y-webrtc': mockModulePath,
            '../../node_modules/lib0/environment.js': mockModulePath,
            '../node_modules/lib0/environment.js': mockModulePath,
            '../node_modules/lib0': mockModulePath,
            '../../node_modules/lib0': mockModulePath,*/
          },
          fallback: {
            ...config.resolve.fallback,
            "fs": false,
          }
        },
        module: {
          ...config.module,
          rules: [
            ...config.module.rules,
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false
              },
            },
          ]
        }
      };


      return newConfig;
    },
  },
  collections: [
    LexicalCustomized,
    RichText,
    Users,
    Media,
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
    //LexicalPlugin(),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
});
