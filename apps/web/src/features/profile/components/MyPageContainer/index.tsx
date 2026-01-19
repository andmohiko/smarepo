import { useRouter } from 'next/router'
import { IoSettingsOutline } from 'react-icons/io5'
import { FlexBox } from '~/components/Base/FlexBox'
import { IconButton } from '~/components/Buttons/IconButton'
import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { ProfileContainer } from '~/features/profile/components/ProfileContainer'
import { useMyProfile } from '~/hooks/useMyProfile'

export const MyPageContainer = (): React.ReactNode => {
  const [myProfile] = useMyProfile()
  const { push } = useRouter()

  return (
    <DefaultLayout
      headerRightIcon={
        <IconButton
          icon={<IoSettingsOutline size={24} />}
          onClick={() => push('/i/settings')}
        />
      }
    >
      <FlexBox gap={16} px={16} py={16}>
        {myProfile && <ProfileContainer profile={myProfile} isMyPage />}
      </FlexBox>
    </DefaultLayout>
  )
}
