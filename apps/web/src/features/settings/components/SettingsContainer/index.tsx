import { FlexBox } from '~/components/Base/FlexBox'
import { NavLink } from '~/components/Displays/NavLink'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { HeadingText } from '~/components/Typography/HeadingText'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const SettingsContainer = (): React.ReactNode => {
  const { logout } = useFirebaseAuthContext()
  return (
    <FlexBox gap={32} px={8} py={16}>
      <FlexBox align="flex-start" gap={0}>
        <HeadingText size="md">その他</HeadingText>
        <FlexBox px={4} gap={8}>
          <NavLink
            label="利用規約"
            href="https://www.notion.so/874f7e1046f94d959b61025c2f663ecd"
            target="_blank"
          />
          <NavLink
            label="お問い合わせ"
            href="https://forms.gle/jbcq53PqTzPotSU96"
            target="_blank"
          />
        </FlexBox>
      </FlexBox>
      <BasicButton importance="tertiary" fullWidth onClick={logout}>
        ログアウト
      </BasicButton>
    </FlexBox>
  )
}
