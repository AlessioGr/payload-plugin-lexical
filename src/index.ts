import { Config } from 'payload/config';
import { PluginConfig } from './types';

const lexical = (pluginConfig: PluginConfig) => (config: Config): Config => {
  return ({
    ...config,
  })
};

export default lexical;
