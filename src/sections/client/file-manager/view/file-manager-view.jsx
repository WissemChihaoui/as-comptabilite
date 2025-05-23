import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { usePutRecords } from 'src/actions/user';

import { useTable } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';
import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerGridView } from '../file-manager-grid-view';

// ----------------------------------------------------------------------

export function FileManagerView({ folders, setServiceStatus, status }) {
  const { user } = useMockedUser();
  const { updateRecords } = usePutRecords();

  const canEdit = status === 'pending' || status === 'none' || status === 'rejected';

  const [matricule, setMatricule] = useState(user.matricule);
  const [adresse, setAdresse] = useState(user.adresse);

  const table = useTable({ defaultRowsPerPage: 10 });

  const confirm = useBoolean();

  const notFound = !folders.length;

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!/^\d{13}$/.test(matricule)) {
      toast.error('Le matricule doit contenir exactement 13 chiffres.');
      return;
    }
    toast.promise(updateRecords({ adresse, matricule }), {
      loading: 'Mise à jour en cours...',
      success: 'Profil mis à jour avec succès!',
      error: 'Échec de la mise à jour du profil!',
    });
  };

  const SubmitFiles = async (e) => {
    e.preventDefault();

    if (matricule && adresse) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/form/4`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Handle the response status
        switch (response.data.status) {
          case 'form_not_found':
            toast.info('Remplissez les documents nécessaires.');
            break;
          case 'submitted_for_review':
            toast.success('Formulaire soumis pour révision.');
            setServiceStatus({ value: 'review', label: 'En attente', color: 'warning' }); // Update the status
            break;
          case 'form_in_review':
            toast.warning('Le formulaire est déjà en révision.');
            break;
          case 'form_accepted':
            toast.success('Formulaire accepté.');
            setServiceStatus({ value: 'accepted', label: 'Accepté', color: 'success' }); // Update the status
            break;
          default:
            toast.error('Erreur inattendue.');
            break;
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire:", error);
        toast.error("Échec de l'envoi du formulaire. Veuillez réessayer.");
      }
    } else {
      toast.info('Complétez vos informations!');
    }
  };

  return (
    <>
      <Typography mb={2} variant="h6">
        Information générale
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Numéro de matricule luxembourgeois</InputLabel>
          <TextField
            fullWidth
            value={matricule}
            error={!!matricule && !/^\d{13}$/.test(matricule)}
            helperText={
              !!matricule && !/^\d{13}$/.test(matricule)
                ? 'Le numéro doit contenir exactement 13 chiffres'
                : ''
            }
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, '');
              setMatricule(onlyNums.slice(0, 13));
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Résidence actuelle</InputLabel>
          <TextField
            fullWidth
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            disabled={!canEdit}
          />
        </Grid>
      </Grid>
      <Stack py={2} alignItems="flex-end">
        <Button variant="contained" color="primary" onClick={(e) => SubmitData(e)}>
          Valider
        </Button>
      </Stack>
      <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
      <Typography mb={2} variant="h6">
        Documents à fournir
      </Typography>
      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <FileManagerGridView
          table={table}
          dataFiltered={folders}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
          canEdit={canEdit}
        />
      )}
      <Stack my={2} alignItems="flex-start">
        <Button variant="contained" color="primary" onClick={(e) => SubmitFiles(e)}>
          Envoyer ma demande
        </Button>
      </Stack>
    </>
  );
}
