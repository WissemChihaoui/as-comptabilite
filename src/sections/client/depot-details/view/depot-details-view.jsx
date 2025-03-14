import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { dropFiles, fetchDocuments } from 'src/actions/documents';
import { fDate } from 'src/utils/format-time';
import { STORAGE_KEY } from 'src/auth/context/jwt';

export default function DepotDetailsView({ id }) {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const documents = await fetchDocuments(4);
        console.log(documents);
        setFiles(documents.filter((row) => row.document_id === Number(id)));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, [id]);
  const open = useBoolean();
  console.log('files :', files);
  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      try {
        const response = await dropFiles(acceptedFiles, 4, id); // Call dropFiles with the required parameters
        console.log('✅ Upload Successful:', response);
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      } catch (error) {
        console.error('❌ Error uploading files:', error.message);
      }
    },
    [id]
  );

  const handleRemoveFile = async (inputFile) => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY); // Retrieve auth token from storage
      console.log(token);
      const response = await fetch(`http://127.0.0.1:8000/api/documents/${inputFile.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Check if the response has a body
        const errorData = await response.text(); // Use text() to handle empty responses
        let jsonData;
        try {
          jsonData = JSON.parse(errorData); // Attempt to parse JSON
        } catch {
          throw new Error(errorData || 'Erreur lors de la suppression');
        }
        throw new Error(jsonData.message || 'Erreur lors de la suppression');
      }

      // Update UI by filtering out the deleted file
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== inputFile.id));

      console.log('✅ Document supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur de suppression:', error.message);
    }
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
                key={index}
                sx={{
                  p: 3,
                  height: 250,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <Typography>{file.original_name}</Typography>
                <Typography variant="caption">{fDate(file.updated_at)}</Typography>
                <Box gap={2}>
                  {/* <TextField label="Nom de fichier" fullWidth /> */}
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
              <Select
                inputProps={{ id: 'depot-situation-familiale' }}
                label="Situation familiale"
                input={<OutlinedInput label="Situation familiale" />}
              >
                <MenuItem value="Celebataire">Célébataire</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
