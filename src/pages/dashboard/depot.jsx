import { Helmet } from 'react-helmet-async';
import { useGetDocuments } from 'src/actions/documents';

import { CONFIG } from 'src/config-global';
import DepotView from 'src/sections/client/depot/views/depot-views';

import { FileManagerView } from 'src/sections/client/file-manager/view';

// ----------------------------------------------------------------------

const metadata = { title: `Déclaration d’impôt - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(4);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DepotView data={documents} loading={documentsLoading}/>
    </>
  );
}
