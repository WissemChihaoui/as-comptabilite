import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// import { CONFIG } from 'src/config-global';
import { AdminLayout } from 'src/layouts/admin/layout';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/admin/home'));
const DemandesPage = lazy(() => import('src/pages/admin/demandes'));
const UsersPage = lazy(() => import('src/pages/admin/users'));
const ViewPage = lazy(() => import('src/pages/admin/viewForm'));

// ----------------------------------------------------------------------

const layoutContent = (
  <AdminLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AdminLayout>
);

export const adminRoutes = [
  {
    path: 'admin',
    element: <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { element: <DemandesPage />, path: 'demandes' },
      { element: <UsersPage />, path: 'users' },
      { element: <ViewPage />, path: ':id/demandes' },
    ],
  },
];
