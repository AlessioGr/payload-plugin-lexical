import { type Config } from 'payload/config';

import { OpenAIApi, Configuration } from 'openai';

async function callOpenAI(text: string, openai: OpenAIApi): Promise<string> {
  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You only complete the provided text - in any language.',
      },
      {
        role: 'user',
        content: `Complete this sentence. Even if you cannot understand it, try to answer with what's most likely to come next. Do not use any placeholders and write like the author would write - no matter what language it is: ${text}`,
      },
    ],
  });

  return result?.data?.choices[0]?.message?.content ?? '';
}

export const LexicalPlugin =
  (pluginOptions: { ai?: { openai_key: string } }) =>
  (config: Config): Config => {
    if (config.endpoints == null) {
      config.endpoints = [];
    }

    if (pluginOptions?.ai?.openai_key != null) {
      const configuration = new Configuration({
        apiKey: pluginOptions.ai.openai_key,
      });
      const openai = new OpenAIApi(configuration);

      config.endpoints.push({
        path: '/openai-completion',
        method: 'get',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        handler: async (req, res, next): Promise<void> => {
          try {
            const text = req.query.text as string; // ?? TODO
            const match: string = await callOpenAI(text, openai);
            if (match.length > 0) {
              res.status(200).send({ match });
            } else {
              res.status(404).send({ error: 'not found' });
            }
          } catch (e) {
            console.error(e);
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
