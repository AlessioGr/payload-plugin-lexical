import { Config } from 'payload/config';

export const lexicalPlugin = () => (config: Config): Config => {
  return ({
    ...config,
  })
};

export { lexicalRichTextField } from './fields/lexicalRichTextField'
