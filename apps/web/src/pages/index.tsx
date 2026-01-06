import type { NextPage } from 'next'

import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { MatchListContainer } from '~/features/match/components/MatchListContainer'

const IndexPage: NextPage = () => {
  return (
    <DefaultLayout>
      <MatchListContainer />
    </DefaultLayout>
  )
}

export default IndexPage
