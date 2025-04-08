import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useUpdateUser } from 'src/actions/user';
import { USER_SITUATIONS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Le nom est obligatoire !' }),
  email: zod
    .string()
    .min(1, { message: 'Email est obligatoire !' })
    .email({ message: "L'adresse e-mail doit être valide !" }),

  // Not required
  situation: zod.string(),
  matricule: zod.string(),
  adresse: zod.string(),
  demenagement: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const { updateUser } = useUpdateUser();
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      demenagement: currentUser?.demenagement || '',
      matricule: currentUser?.matricule || '',
      adresse: currentUser?.adresse || '',
      situation: currentUser?.situation,
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUser(currentUser.id, data);

      toast.success('Utilisateur mis à jour avec succès !');
      reset();
      onClose();
    } catch (error) {
      toast.error("Une erreur s'est produite !");
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Modifier {currentUser?.name}</DialogTitle>

        <DialogContent>
          <Box
            mt={3}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="name" label="Nom Complét" />
            <Field.Text name="email" label="Email" />

            <Field.DatePicker name="demenagement" label="Démenagement" />
            <Field.Text name="matricule" label="Matricule" />
            <Field.Text name="adresse" label="Adresse" />
            <Field.Select name="situation" label="Situation">
              {USER_SITUATIONS_OPTIONS.map((situation) => (
                <MenuItem key={situation.label} value={situation.label}>
                  {situation.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Confirmer
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
