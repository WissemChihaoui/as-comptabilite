import React, { useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { SARL_DOC } from 'src/_mock/_categories';
import { Iconify } from 'src/components/iconify';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { FileManagerView } from '../single-files/view';

export default function SarlPageView({data, loading}) {
    const renderLoading = <ProductItemSkeleton />;
  
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Constitution d'entreprise SARL"
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
          action={<Label color="info">En cours</Label>}
        />
        
        {loading ? renderLoading : <FileManagerView files={data} /> }
      </DashboardContent>
    </>
  );
}
