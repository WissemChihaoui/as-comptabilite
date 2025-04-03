import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Button, MenuItem, MenuList } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useMockedUser } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';

export default function HomePageView() {
  const { user } = useMockedUser();
  const popover = usePopover();
  const router = useRouter();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Accueil"
          links={[
            {
              name: 'Accueil',
              href: '#',
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Grid spacing={4}>
          <AppWelcome
            title={`Bonne journée 👋 \n ${user?.displayName}`}
            description="Commencez à déposer vos dossiers dès maintenant, vous pouvez choisir entre "
            img={<SeoIllustration hideBackground />}
            action={
              <Stack spacing={2} flexDirection={{ sx: 'column', md: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.demande}
                >
                  Demande d&apos;autorisation
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.declarationImpot}
                >
                  Déclaration d’impôt
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button onClick={popover.onOpen} variant="contained" color="info">
                  Constitution d&apos;entreprise
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
              </Stack>
            }
          />
        </Grid>
      </DashboardContent>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.sarl);
            }}
          >
            SARL
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.sarls);
            }}
          >
            SARL-S
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
