import { Config } from 'payload/config';
export declare const LexicalPlugin: (pluginOptions: {
    ai?: {
        openai_key: string;
    };
}) => (config: Config) => Config;
export { lexicalRichTextField } from './fields/lexicalRichTextField';
export * from './features/index';
export * from './types';
export { OPEN_MODAL_COMMAND } from './fields/LexicalRichText/plugins/ModalPlugin/index';
export * from './fields/LexicalRichText/ui/DropDown';
export * from './fields/LexicalRichText/LexicalEditorComponent';
export * from './fields/LexicalRichText/nodes/PlaygroundNodes';
export * from './fields/LexicalRichText/themes/PlaygroundEditorTheme';
