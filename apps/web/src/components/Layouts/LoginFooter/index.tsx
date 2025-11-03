import styles from './style.module.scss'

import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { UnstyledButton } from '~/components/Buttons/UnstyledButton'
import { BaseText } from '~/components/Typography-org/BaseText'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const LoginFooter = (): React.ReactNode => {
  const { login } = useFirebaseAuthContext()
  return (
    <div className={styles.loginFooter}>
      <FlexBox align="flex-start">
        <BaseText size="xl" weight="bold">
          ポケカのデータの
          <br />
          すべてがここに
        </BaseText>
      </FlexBox>
      <FlexBox align="flex-end" gap={16}>
        <BasicButton onClick={login}>新規登録</BasicButton>
        <UnstyledButton onClick={login}>
          <span className={styles.login}>ログインはこちら</span>
        </UnstyledButton>
      </FlexBox>
    </div>
  )
}
