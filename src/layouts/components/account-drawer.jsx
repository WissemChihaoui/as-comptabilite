import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';
import { statusData } from 'src/_mock/_status';
import { useGetMyForms } from 'src/actions/forms';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateAvatar } from 'src/components/animate';

import {  useMockedUser } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export function AccountDrawer({ sx, ...other }) {
  const theme = useTheme();

  const { forms } = useGetMyForms()
  console.log(forms)
  const { user } = useMockedUser();

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: user?.photoURL, alt: user?.displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.displayName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        onClick={handleOpenDrawer}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>
          </Stack>

         <Stack
  spacing={2}
  sx={{
    py: 3,
    px: 2.5,
    borderTop: `dashed 1px ${theme.vars.palette.divider}`,
    borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
  }}
>
  {forms && forms.length > 0 ? (
    forms.map((form) => {
      const status = statusData.find((s) => s.value === form.status) || {
        label: form.status,
        color: 'default',
      };

      return (
        <Box
          key={form.id}
          sx={{
            p: 2,
            borderRadius: 1.5,
            bgcolor: 'background.neutral',
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            {form.service?.name ?? 'Service inconnu'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
           
            <Box
              component="span"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: `${status.color}.main`,
                color: 'common.white',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {status.label}
            </Box>
          </Box>
        </Box>
      );
    })
  ) : (
    <Typography variant="body2" color="text.secondary">
      Aucun formulaire trouvé.
    </Typography>
  )}
</Stack>

        </Scrollbar>
    
        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
