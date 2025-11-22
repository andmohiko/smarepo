import type { Profile, SerializedProfile } from '@smarepo/common'
import dayjs from 'dayjs'
import type { GetServerSideProps, NextPage } from 'next'
import { useMemo } from 'react'
import { InnerLayout } from '~/components/Layouts/InnerLayout'
import { UserPageContainer } from '~/features/profile/components/UserPageContainer'
import { fetchProfileByUsernameOperation } from '~/infrastructure/firebaseAdmin/ProfileOperations'

type Props = {
  profile: SerializedProfile | null | undefined
}

const UserProfilePage: NextPage<Props> = ({ profile }) => {
  // クライアント側で文字列をDateオブジェクトに変換
  const deserializedProfile: Profile | null | undefined = useMemo(() => {
    if (!profile) {
      return null
    }
    return {
      ...profile,
      createdAt: dayjs(profile.createdAt).toDate(),
      updatedAt: dayjs(profile.updatedAt).toDate(),
    } as Profile
  }, [profile])
  return (
    <InnerLayout>
      <UserPageContainer profile={deserializedProfile} />
    </InnerLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { username } = context.query
  const profile = await fetchProfileByUsernameOperation(username as string)
  if (profile?.isPrivateProfile) {
    return {
      props: { profile: null },
    }
  }
  return { props: { profile } }
}

export default UserProfilePage
