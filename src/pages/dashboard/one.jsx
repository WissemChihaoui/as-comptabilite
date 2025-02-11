import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import HomePageView from 'src/sections/client/home/home-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `Accueil - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <HomePageView />
    </>
  );
}
