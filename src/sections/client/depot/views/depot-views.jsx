import React, { useEffect, useState, useMemo } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';
import { Label } from 'src/components/label';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import axios from 'axios';
import { statusData } from 'src/_mock/_status';

import { FileManagerView } from '../../file-manager/view';

export default function DepotView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;

  // 🏆 Optimize status data with useMemo
  

  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: 'Chargement...',
    color: 'default',
  });

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/4`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
            'Content-Type': 'application/json',
          },
        });

        // console.log('Response:', response.data);

        const fetchedStatus = response.data.status || 'none'; // Default to 'none' if no status found

        const selectedStatus =
          statusData.find((status) => status.value === fetchedStatus) || statusData[0]; // Default to "Pas demandé"

        setServiceStatus(selectedStatus);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        setServiceStatus(statusData[0]); // Set to "Pas demandé" on error
      }
    };

    fetchServiceStatus();
  }, [data]); // ✅ Depend on statusData to prevent stale closure issues

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Déclaration d'impôt"
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
          action={<Label color={serviceStatus.color}>{serviceStatus.label}</Label>} // ✅ Dynamic status
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {loading ? renderLoading : <FileManagerView folders={data} setServiceStatus={setServiceStatus} status={serviceStatus.value}/>}
      </DashboardContent>
    </>
  );
}
