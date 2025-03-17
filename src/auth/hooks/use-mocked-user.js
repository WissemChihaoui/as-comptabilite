import dayjs from 'dayjs';
import { _mock } from 'src/_mock';
import { useGetUser } from 'src/actions/user';
import { fDateTime } from 'src/utils/format-time';

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const { userData } = useGetUser();

  const user = {
    id: userData?.id || '',
    displayName: userData?.name || '',
    email: userData?.email || '',
    photoURL: _mock.image.avatar(24),
    matricule: userData?.matricule || '',
    demenagement: dayjs(userData?.demenagement) || null,
    adresse: userData?.adresse || '',
    situation: userData?.situation || '',
    role: 'client',
    isPublic: true,
  };

  // console.log("user :", user)

  return { user };
}
