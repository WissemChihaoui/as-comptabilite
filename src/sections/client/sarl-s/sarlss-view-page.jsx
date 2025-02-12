import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { SARLS_DOC } from 'src/_mock/_categories';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { FileManagerView } from '../single-files/view';

export default function SarlssViewPage() {
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Constitution d'entreprise SARL-S"
          links={[
            {
              name: 'Accueil',
              href: paths.dashboard.root,
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: "Constitution d'entreprise SARL",
              href: '#',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
                      <Label color="info">En cours</Label>
                    }
        />
        <FileManagerView files={SARLS_DOC} />
      </DashboardContent>
    </>
  );
}
