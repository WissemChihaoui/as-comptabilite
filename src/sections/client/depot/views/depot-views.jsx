import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { DECLARATION_IMPOT } from 'src/_mock/_categories';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';
import { Label } from 'src/components/label';
import { FileManagerView } from '../../file-manager/view';

export default function DepotView({data, loading}) {
    const renderLoading = <ProductItemSkeleton />;
  
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Déclaration d'impot"
          links={[
            {
              name: 'Accueil',
              href: paths.dashboard.root,
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: 'Déclaration d’impôt',
              href: '#',
            },
          ]}
          action={
            <Label color="info">En cours</Label>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {loading ? renderLoading : <FileManagerView folders={data} /> }
      </DashboardContent>
    </>
  );
}
