import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { SARLS_DOC } from 'src/_mock/_categories';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Divider, InputLabel, Stack, TextField, Typography } from '@mui/material';
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
        <Typography mb={2} variant="h6">
          Information générale
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <InputLabel mb={1}>Numéro de matricule luxembourgeois</InputLabel>
            <TextField fullWidth />
          </Grid>
        </Grid>
        <Stack py={2} alignItems="flex-end">
          <Button variant="contained" color="primary">
            Valider
          </Button>
        </Stack>
        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
        <FileManagerView files={SARLS_DOC} />
      </DashboardContent>
    </>
  );
}
