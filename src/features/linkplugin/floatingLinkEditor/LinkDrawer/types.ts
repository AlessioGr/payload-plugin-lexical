import { type Fields } from 'payload/dist/admin/components/forms/Form/types';
import { type Field } from 'payload/dist/fields/config/types';

export interface Props {
  drawerSlug: string;
  handleClose: () => void;
  handleModalSubmit: (fields: Fields, data: Record<string, unknown>) => void;
  initialState?: Fields;
  fieldSchema: Field[];
}
