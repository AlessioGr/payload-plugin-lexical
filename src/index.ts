import { Config } from 'payload/config';

const lexical = () => (config: Config): Config => {
  return ({
    ...config,
  })
};

export default lexical;
