import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt'; // ✅ added

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email est requis !' })
    .email({ message: 'Email doit être valide !' }),
  password: zod
    .string()
    .min(1, { message: 'Le mot de passe est obligatoire !' })
    .min(6, { message: 'Le mot de passe doit comporter au moins 6 caractères !' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // ✅ added

  const [params] = useSearchParams(); // ✅ added
  const password = useBoolean();

  useEffect(() => {
    const success = params.get('success');
    const error = params.get('error');

    if (success === 'email-verified') {
      setSuccessMsg('Votre adresse e-mail a été vérifiée avec succès. Vous pouvez maintenant vous connecter.');
    }

    if (error === 'invalid-or-expired-link') {
      setErrorMsg('Le lien de vérification est invalide ou a expiré.');
    }

    if (error === 'already-verified') {
      setErrorMsg('Cette adresse e-mail a déjà été vérifiée. Veuillez vous connecter.');
    }
  }, [params]);

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text placeholder="ascompta@email.com" name="email" label="Adresse e-mail" InputLabelProps={{ shrink: true }} />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Mot de passe oublié ?
        </Link>

        <Field.Text
          name="password"
          label="Mot de passe"
          placeholder="6+ caractéres"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Se connecter..."
      >
        Se connecter
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Connectez-vous à votre compte"
        description={
          <>
            {`Vous n'avez pas de compte ? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Commencer
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
