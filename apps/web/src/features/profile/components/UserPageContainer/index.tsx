import type { Profile } from '@smarepo/common'
import { FlexBox } from '~/components/Base/FlexBox'
import {
  ProfileContainer,
  ProfileContainerSkeleton,
} from '~/features/profile/components/ProfileContainer'

type Props = {
  profile: Profile | null | undefined
}

export const UserPageContainer = ({ profile }: Props): React.ReactNode => {
  return (
    <FlexBox gap={16} px={16} py={16}>
      {!profile && <ProfileContainerSkeleton />}
      {profile && <ProfileContainer profile={profile} />}
    </FlexBox>
  )
}
