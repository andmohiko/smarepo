import type { NextPage } from 'next'

import { InnerLayout } from '~/components/Layouts/InnerLayout'
import { SettingsContainer } from '~/features/settings/components/SettingsContainer'

const SettingsPage: NextPage = () => {
  return (
    <InnerLayout title="設定">
      <SettingsContainer />
    </InnerLayout>
  )
}

export default SettingsPage
