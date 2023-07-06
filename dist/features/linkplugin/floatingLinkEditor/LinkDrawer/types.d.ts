import { Field } from 'payload/dist/fields/config/types';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
export type Props = {
    drawerSlug: string;
    handleClose: () => void;
    handleModalSubmit: (fields: Fields, data: Record<string, unknown>) => void;
    initialState?: Fields;
    fieldSchema: Field[];
};
