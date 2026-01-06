import type { NextPage } from 'next'

import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { AnalyticsContainer } from '~/features/analytics/components/AnalyticsContainer'

const AnalyticsPage: NextPage = () => {
  return (
    <DefaultLayout title="マッチアップ分析">
      <AnalyticsContainer />
    </DefaultLayout>
  )
}

export default AnalyticsPage
