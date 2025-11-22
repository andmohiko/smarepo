import type { NextPage } from 'next'
import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { MyPageContainer } from '~/features/profile/components/MyPageContainer'

const MyPagePage: NextPage = () => {
  return (
    <DefaultLayout>
      <MyPageContainer />
    </DefaultLayout>
  )
}

export default MyPagePage
