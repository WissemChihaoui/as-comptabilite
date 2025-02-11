import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import DepotView from 'src/sections/client/depot/views/depot-views';

import { FileManagerView } from 'src/sections/client/file-manager/view';

// ----------------------------------------------------------------------

const metadata = { title: `Déclaration d’impôt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DepotView />
    </>
  );
}
