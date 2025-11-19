import { FlexBox } from '~/components/Base/FlexBox'
import { EditProfileForm } from '~/features/profile/components/EditProfileForm'
import { useMyProfile } from '~/hooks/useMyProfile'

export const EditProfileContainer = (): React.ReactNode => {
  const [profile] = useMyProfile()
  if (!profile) {
    return <div>プロフィールが見つかりません</div>
  }
  return (
    <FlexBox px={16} py={16} align="stretch">
      <EditProfileForm defaultValues={profile} />
    </FlexBox>
  )
}
