import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useParams } from 'src/routes/hooks';
import DepotDetailsView from 'src/sections/client/depot-details/view/depot-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Déclaration d’impôt - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DepotDetailsView id={id}/>
    </>
  );
}
