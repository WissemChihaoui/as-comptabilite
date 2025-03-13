import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { FileManagerView } from '../../single-files/view';

export default function DemandePageView({data, loading}) {
      const renderLoading = <ProductItemSkeleton />;
  
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
        {loading ? renderLoading : <FileManagerView files={data} /> }
      </DashboardContent>
    </>
  );
}
