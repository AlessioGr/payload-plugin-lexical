import { OpenAIApi, Configuration } from 'openai';
import { Config } from 'payload/config';

export const LexicalPlugin = (pluginOptions: { ai?: { openai_key: string } }) => (config: Config): Config => {
  if (!config.endpoints) {
    config.endpoints = [];
  }

  if (pluginOptions?.ai?.openai_key) {
    const configuration = new Configuration({
      apiKey: pluginOptions.ai.openai_key,
    });
    const openai = new OpenAIApi(configuration);

    config.endpoints.push({
      path: '/openai-completion',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const match: string = (
            await openai.createChatCompletion({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content:
                      'You only complete the provided text - in any language.',
                },
                {
                  role: 'user',
                  content:
                      `Complete this sentence. Even if you cannot understand it, try to answer with what's most likely to come next. Do not use any placeholders and write like the author would write - no matter what language it is: ${
                        req.query.text}`,
                },
              ],
            })
          ).data.choices[0].message.content;

          if (match) {
            res.status(200).send({ match });
          } else {
            res.status(404).send({ error: 'not found' });
          }
        } catch (e) {
          console.log(e);
          res.status(500).send({ error: 'error' });
        }
      },
    });
  }

  return config;
};

export { lexicalRichTextField } from './fields/lexicalRichTextField';
export * from './features/index';
export * from './types';
export { OPEN_MODAL_COMMAND } from './fields/LexicalRichText/plugins/ModalPlugin/index';
export * from './fields/LexicalRichText/ui/DropDown';
export * from './fields/LexicalRichText/LexicalEditorComponent';
export * from './fields/LexicalRichText/nodes/PlaygroundNodes';
export * from './fields/LexicalRichText/themes/PlaygroundEditorTheme';
