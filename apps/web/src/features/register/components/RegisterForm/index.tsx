import styles from './style.module.css'

import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { RadioGroup } from '~/components/Inputs/RadioGroup'
import { TextInput } from '~/components/Inputs/TextInput'

export const RegisterForm = (): React.ReactNode => {
  return (
    <form className={styles.form}>
      <FlexBox gap={16} align="stretch">
        <TextInput label="ユーザーID" placeHolder="5~15字の英数字で！" />
        <TextInput label="ユーザー名" placeHolder="日本語でOK🙆‍♀️" />
        <TextInput label="X ID" placeHolder="twitter" leftSection="@" />
        {/* メインファイターを選ぶ */}
        {/* プロフィール公開 */}
        <RadioGroup
          label="プロフィール公開"
          options={[
            { label: '公開', value: 'public' },
            { label: '非公開', value: 'private' },
          ]}
        />
      </FlexBox>
      <FlexBox gap={16} align="stretch">
        <BasicButton>登録</BasicButton>
        <BasicButton importance="tertiary">
          他のGoogleアカウントを使用
        </BasicButton>
      </FlexBox>
    </form>
  )
}
