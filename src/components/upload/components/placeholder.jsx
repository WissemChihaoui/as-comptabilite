import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ sx, ...other }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>Déposer ou sélectionner un fichier</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          Déposez vos fichiers ici ou cliquez sur
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            parcourir
          </Box>
          par lintermédiaire de votre machine.
        </Box>
      </Stack>
    </Box>
  );
}
