import React from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { Iconify } from 'src/components/iconify'
import { SARLS_DOC } from 'src/_mock/_categories'
import { DashboardContent } from 'src/layouts/dashboard'
import { FileManagerView } from '../file-manager/view'

export default function SarlssViewPage() {
  return (
    <>
        <DashboardContent>
                <CustomBreadcrumbs
                  heading="Constitution d'entreprise SARL-S"
                  links={[
                    {
                      name: 'Accueil',
                      href: '#',
                      icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
                    },
                    {
                      name: "Constitution d'entreprise SARL",
                      href: '#',
                    },
                  ]}
                  sx={{ mb: { xs: 3, md: 5 } }}
                />
                <FileManagerView folders={SARLS_DOC}/>
              </DashboardContent>
    </>
  )
}
