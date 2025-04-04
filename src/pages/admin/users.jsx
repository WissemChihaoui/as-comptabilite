import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {UsersListView} from 'src/sections/admin/users/view/users-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des utilisateurs - ${CONFIG.appName}` };

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UsersListView />
    </>
  );
}
