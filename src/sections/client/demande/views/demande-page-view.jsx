import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DEMANDE_AUTORISATION_FOLDERS } from 'src/_mock/_categories';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { FileManagerView } from '../../single-files/view';

export default function DemandePageView() {
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Demande d'autorisation"
          links={[
            {
              name: 'Accueil',
              href: paths.dashboard.root,
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: "Demande d'autorisation",
              href: '#',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={<Label color="info">En cours</Label>}
        />
        <FileManagerView files={DEMANDE_AUTORISATION_FOLDERS} />
      </DashboardContent>
    </>
  );
}
