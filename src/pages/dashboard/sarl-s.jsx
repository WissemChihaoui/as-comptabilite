import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import SarlssViewPage from 'src/sections/client/sarl-s/sarlss-view-page';

// ----------------------------------------------------------------------

const metadata = { title: `SARL-S - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SarlssViewPage />
    </>
  );
}
