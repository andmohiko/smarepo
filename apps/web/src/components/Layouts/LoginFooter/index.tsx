import styles from './style.module.scss'

import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { UnstyledButton } from '~/components/Buttons/UnstyledButton'
import { ParagraphText } from '~/components/Typography/ParagraphText'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const LoginFooter = (): React.ReactNode => {
  const { login } = useFirebaseAuthContext()
  return (
    <div className={styles.loginFooter}>
      <FlexBox align="flex-start">
        <ParagraphText size="md" weight="bold">
          スマブラのデータの
          <br />
          すべてがここに
        </ParagraphText>
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
