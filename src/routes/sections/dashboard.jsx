import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const DepotPage = lazy(() => import('src/pages/dashboard/depot'));
const DepotDropPage = lazy(() => import('src/pages/dashboard/depot-drop'));
const Demande = lazy(() => import('src/pages/dashboard/demande'));

const Sarl = lazy(() => import('src/pages/dashboard/sarl'));
const SarlS = lazy(() => import('src/pages/dashboard/sarl-s'));
// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { element: <DepotPage />, path: 'declaration-impot'},
      { element: <DepotDropPage />, path: 'declaration-impot/:id'},
      { element: <Demande />, path: 'demande'},
      { element: <Sarl />, path: 'sarl'},
      { element: <SarlS />, path: 'sarls'},
    ],
  },
];
