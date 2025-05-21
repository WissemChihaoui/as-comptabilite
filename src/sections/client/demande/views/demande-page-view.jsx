import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { statusData } from 'src/_mock/_status';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerView } from '../../single-files/view';

export default function DemandePageView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;
  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: 'Chargement...',
    color: 'default',
  });

  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/1`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data)
        const fetchedStatus = response.data.status || 'none';

        const selectedStatus =
          statusData.find((status) => status.value === fetchedStatus) || statusData[0];
        if (response.data.note) {
          setNote(response?.data?.note);
        } else {
          setNote('Non précisée');
        }
        setServiceStatus(selectedStatus);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        setServiceStatus(statusData[0]);
      }
    };

    fetchServiceStatus();
  }, [data]);

  return (
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
        action={
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Label sx={{width: 'min-content'}} color={serviceStatus.color}>{serviceStatus.label}</Label>
            <Typography maxWidth={300} variant='caption'>Remarque : {note}</Typography>
          </Box>
        }
      />
      {loading ? (
        renderLoading
      ) : (
        <FileManagerView files={data} setServiceStatus={setServiceStatus} serviceId={1} />
      )}
    </DashboardContent>
  );
}
