import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

export default function DepotPageView() {
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Déclaration d’impôt"
          links={[
            {
              name: 'Accueil',
              href: '#',
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: 'Déclaration d’impôt',
              href: '#',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>
    </>
  );
}
