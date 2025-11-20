import { FlexBox } from '~/components/Base/FlexBox'
import { ProfileContainer } from '~/features/profile/components/ProfileContainer'
import { useMyProfile } from '~/hooks/useMyProfile'
import { useUserProfile } from '~/hooks/useUserProfile'

type Props = {
  username: string
}

export const UserPageContainer = ({ username }: Props): React.ReactNode => {
  const [myProfile] = useMyProfile()
  const [profile] = useUserProfile(username)

  return (
    <FlexBox gap={16} px={16} py={16}>
      {profile && (
        <ProfileContainer
          profile={profile}
          isMyPage={myProfile?.username === username}
        />
      )}
    </FlexBox>
  )
}
