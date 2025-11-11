import type { NextPage } from 'next'

import { MyPageContainer } from '~/features/profile/components/MyPageContainer'
import { DefaultLayout } from '~/components/Layouts/DefaultLayout'

const MyPagePage: NextPage = () => {
  return (
    <DefaultLayout>
      <MyPageContainer />
    </DefaultLayout>
  )
}

export default MyPagePage
