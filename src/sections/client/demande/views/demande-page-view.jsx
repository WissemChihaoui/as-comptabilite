
import React from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { Iconify } from 'src/components/iconify'
import { DEMANDE_AUTORISATION_FOLDERS } from 'src/_mock/_categories'
import { DashboardContent } from 'src/layouts/dashboard'
import { FileManagerView } from '../../file-manager/view'
import FilesView from '../../single-files/view/files-view'

export default function DemandePageView() {
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Demande d'autorisation"
          links={[
            {
              name: 'Accueil',
              href: '#',
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: "Demande d'autorisation",
              href: '#',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <FileManagerView folders={DEMANDE_AUTORISATION_FOLDERS}/>

        {/* <FilesView /> */}
      </DashboardContent>
    </>
  )
}
