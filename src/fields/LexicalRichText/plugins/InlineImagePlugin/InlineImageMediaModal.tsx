import * as React from 'react';

import { Drawer } from 'payload/components/elements';
import { ListDrawerContent } from 'payload/distadmin/components/elements/ListDrawer/DrawerContent';
import { baseClass } from 'payload/distadmin/components/elements/ListDrawer/index';

export function InlineImageMediaModal(props): JSX.Element {
  const { drawerSlug } = props;
  return (
    <Drawer slug={drawerSlug ?? ''} className={baseClass} header={false} gutter={false}>
      <ListDrawerContent {...props} />
    </Drawer>
  );
}
