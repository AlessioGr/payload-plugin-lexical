import { Config } from 'payload/config';
import path from "path";

const LexicalPlugin = () => (origConfig: Config): Config => {
  return ({
    ...origConfig,
    /*admin: {
      ...origConfig.admin,
      webpack: (config) => {
        const newConfig = {
          ...config,
          resolve: {
            ...config.resolve,
            alias: {
              ...config.resolve.alias,
              '@faceless-ui/modal': path.resolve(__dirname, '../node_modules/@faceless-ui/modal')
            },
          },
        };

        return newConfig;
      },
    }*/
  })
};

export default LexicalPlugin;
