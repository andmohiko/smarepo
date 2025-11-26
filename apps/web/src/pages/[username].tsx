import type { Profile, SerializedProfile } from '@smarepo/common'
import dayjs from 'dayjs'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
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

  // OGP用のメタタグ
  const pageTitle = profile
    ? `${profile.displayName} (@${profile.username}) | スマレポ`
    : 'スマレポ'
  const pageDescription =
    profile?.selfIntroduction || 'スマブラ戦績記録・分析アプリ'
  const ogpImageUrl =
    profile?.ogpImageUrl || `${process.env.NEXT_PUBLIC_APP_URL}/images/ogp.png`
  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${profile?.username || ''}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* OGP */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="スマレポ" />
        <meta property="og:image" content={ogpImageUrl} />
        <meta property="og:type" content="profile" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@andmohiko" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogpImageUrl} />
      </Head>
      <InnerLayout>
        <UserPageContainer profile={deserializedProfile} />
      </InnerLayout>
    </>
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
