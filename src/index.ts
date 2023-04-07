import { Config } from "payload/config";

export const lexicalPlugin =
  () =>
  (config: Config): Config => {
    return {
      ...config,
    };
  };

export { lexicalRichTextField } from "./fields/lexicalRichTextField";
export * from "./features/index";
export * from "./types";
export { OPEN_MODAL_COMMAND } from "./fields/LexicalRichText/plugins/ModalPlugin/index";
export * from "./fields/LexicalRichText/ui/DropDown";
