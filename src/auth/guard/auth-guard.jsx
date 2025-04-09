import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(pathname)

  const { authenticated, loading, user } = useAuthContext();

  console.log("from auth-guard :", user)
  console.log("Required ", user?.role)

  const [isChecking, setIsChecking] = useState(true);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = async () => {
    if (loading) return;

    // 🚫 Not authenticated
    if (!authenticated) {
      const { method } = CONFIG.auth;

      const signInPath = {
        jwt: paths.auth.jwt.signIn,
        auth0: paths.auth.auth0.signIn,
        amplify: paths.auth.amplify.signIn,
        firebase: paths.auth.firebase.signIn,
        supabase: paths.auth.supabase.signIn,
      }[method];

      const href = `${signInPath}?${createQueryString('returnTo', pathname)}`;
      router.replace(href);
      return;
    }
    setIsChecking(false);

    // 🔐 Check role
    if (user && user?.role) {
      // Redirect unauthorized users (e.g., user trying to access /admin)
      if(user?.role=== "admin" && !pathname.includes('admin')) router.replace(paths.admin.root);
      if(user?.role=== "user" && !pathname.includes('dashboard')) router.replace(paths.dashboard.root);
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
