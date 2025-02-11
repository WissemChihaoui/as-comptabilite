import { Button, MenuItem, MenuList, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { SeoIllustration } from 'src/assets/illustrations';
import { useMockedUser } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWelcome } from '../app-welcome';

export default function HomePageView() {
  const { user } = useMockedUser();
  const popover = usePopover();
  const router = useRouter()

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
              <Stack spacing={2} flexDirection="row">
                <Button variant="contained" color="primary" LinkComponent={RouterLink} href={paths.dashboard.demande}>
                  Demande d&apos;autorisation
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button variant="contained" color="secondary" LinkComponent={RouterLink} href={paths.dashboard.declarationImpot}>
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
              router.push(paths.dashboard.sarl)
            }}
          >
            
            SARL
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.sarls)

            }}
          >
            SARL-S
          </MenuItem>

       
        </MenuList>
      </CustomPopover>
    </>
  );
}
