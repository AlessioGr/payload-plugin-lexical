import { Config } from 'payload/config';
import { PluginConfig } from './types';
declare const lexical: (pluginConfig: PluginConfig) => (config: Config) => Config;
export default lexical;
