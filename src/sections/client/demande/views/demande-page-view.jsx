import React, { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { statusData } from 'src/_mock/_status';
import { Label } from 'src/components/label';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import axios from 'axios';
import { FileManagerView } from '../../single-files/view';

export default function DemandePageView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;
  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: 'Chargement...',
    color: 'default',
  });

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/1`, {
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
  }, [data]);

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
          action={<Label color={serviceStatus.color}>{serviceStatus.label}</Label>} // ✅ Dynamic status
        />
        {loading ? renderLoading : <FileManagerView files={data} setServiceStatus={setServiceStatus} serviceId={1}/>}
      </DashboardContent>
    </>
  );
}
