import * as React from 'react';

import { Drawer } from 'payload/dist/admin/components/elements/Drawer';
import { baseClass } from 'payload/dist/admin/components/elements/ListDrawer';
import { ListDrawerContent } from 'payload/dist/admin/components/elements/ListDrawer/DrawerContent';

export function InlineImageMediaModal(props): JSX.Element {
  const { drawerSlug } = props;
  return (
    <Drawer slug={drawerSlug ?? ''} className={baseClass} header={false} gutter={false}>
      <ListDrawerContent {...props} />
    </Drawer>
  );
}
