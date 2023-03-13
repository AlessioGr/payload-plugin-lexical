import {RichTextField} from "payload/types";


export type Props = Omit<RichTextField, 'type'> & {
  editorConfig?: any,
  path?: string
}
