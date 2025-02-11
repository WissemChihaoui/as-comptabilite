import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import SarlPageView from 'src/sections/client/sarl/sarl-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `SARL - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SarlPageView />
    </>
  );
}
