import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { UserPageContainer } from '~/features/profile/components/UserPageContainer'

const UserProfilePage: NextPage = () => {
  const { query } = useRouter()
  const username = query.username as string
  return (
    <DefaultLayout>
      <UserPageContainer username={username} />
    </DefaultLayout>
  )
}

export default UserProfilePage
