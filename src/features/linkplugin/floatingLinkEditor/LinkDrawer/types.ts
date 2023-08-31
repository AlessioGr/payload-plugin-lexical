import { type Fields } from 'payload/distadmin/components/forms/Form/types';
import { type Field } from 'payload/types';

export interface Props {
  drawerSlug: string;
  handleClose: () => void;
  handleModalSubmit: (fields: Fields, data: Record<string, unknown>) => void;
  initialState?: Fields;
  fieldSchema: Field[];
}
