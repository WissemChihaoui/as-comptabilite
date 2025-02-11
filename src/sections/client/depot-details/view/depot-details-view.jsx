import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useCallback, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { MultiFilePreview, SingleFilePreview, Upload, UploadBox } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';

export default function DepotDetailsView({ id }) {
  const [files, setFiles] = useState([]);

  const open = useBoolean();

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  console.log(files);
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Dépot"
          links={[
            {
              name: 'Accueil',
              href: paths.dashboard.root,
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: 'Déclaration d’impôt',
              href: paths.dashboard.declarationImpot,
            },
            {
              name: 'Déposer',
            },
          ]}
          
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap={3}
        >
          {files.length > 0 &&
            files.map((file, index) => (
              <Card
                sx={{
                  p: 3,
                  height: 250,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <Typography>{file.name}</Typography>
                <Box gap={2}>
                  <TextField label="Nom de fichier" fullWidth />
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveFile(file)}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Card>
            ))}
          <Card sx={{ height: 250 }}>
            <UploadBox
              sx={{ width: '100%', height: '100%' }}
              placeholder={
                <Box
                  sx={{
                    gap: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.disabled',
                    flexDirection: 'column',
                  }}
                >
                  <Iconify icon="eva:cloud-upload-fill" width={40} />
                  <Typography variant="body2">Télécharger le fichier</Typography>
                </Box>
              }
              multiple
              value={files}
              onDrop={handleDropMultiFile}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Card>
        </Box>
      </DashboardContent>

      <Dialog open={open.value} onClose={open.onFalse}>
        <DialogTitle>Vérifier votre information générale</DialogTitle>
        <DialogContent>
          <Box p={2} flexDirection="column" display="flex">
            <DatePicker label="Date de déménagement" sx={{ mb: 2.5 }} />
            <TextField label="Résidence actuelle" sx={{ mb: 2.5 }} />
            <FormControl>
            <InputLabel htmlFor="depot-situation-familiale">Situation familiale</InputLabel>
            <Select inputProps={{ id: 'depot-situation-familiale' }} label="Situation familiale" input={<OutlinedInput label="Situation familiale" />}>
                <MenuItem value="Celebataire">Célébataire</MenuItem>
            </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button variant='contained' color='primary'>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
