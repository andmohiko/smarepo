import { FlexBox } from '~/components/Base/FlexBox'
import { ProfileContainer } from '~/features/profile/components/ProfileContainer'
import { useMyProfile } from '~/hooks/useMyProfile'

export const MyPageContainer = (): React.ReactNode => {
  const [myProfile] = useMyProfile()

  return (
    <FlexBox gap={16} px={16} py={16}>
      {myProfile && <ProfileContainer profile={myProfile} isMyPage />}
    </FlexBox>
  )
}
