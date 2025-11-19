import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { ProfileImageInput } from '~/components/Inputs/ProfileImageInput'
import { TextInput } from '~/components/Inputs/TextInput'
import { useCreateProfileMutation } from '~/features/register/hooks/useCreateProfileMutation'
import {
  type RegisterInputType,
  registerSchema,
} from '~/features/register/types'
import { useToast } from '~/hooks/useToast'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { useLoadingContext } from '~/providers/LoadingProvider'
import { errorMessage } from '~/utils/errorMessage'
import styles from './style.module.css'

export const RegisterForm = (): React.ReactNode => {
  const { push } = useRouter()
  const { uid } = useFirebaseAuthContext()
  const { startLoading, stopLoading } = useLoadingContext()
  const { showErrorToast, showSuccessToast } = useToast()
  const { createProfile } = useCreateProfileMutation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      username: '',
      xId: '',
      profileImageUrl: '',
      mainFighter: '',
    },
  })

  const onSubmit = async (data: RegisterInputType) => {
    try {
      startLoading()
      await createProfile(data)
      showSuccessToast('ユーザー登録が完了しました')
      push('/')
    } catch (e) {
      showErrorToast(errorMessage(e))
    } finally {
      stopLoading()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <FlexBox gap={16} align="stretch">
        <Controller
          control={control}
          name="profileImageUrl"
          render={({ field }) => (
            <ProfileImageInput
              label="プロフィール画像"
              value={field.value}
              onChange={field.onChange}
              error={errors.profileImageUrl?.message}
              storagePath={`/images/users/${uid}`}
            />
          )}
        />
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <TextInput
              label="ユーザーID"
              placeHolder="5~15字の英数字で！"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="displayName"
          render={({ field }) => (
            <TextInput
              label="ユーザー名"
              placeHolder="日本語でOK🙆‍♀️"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.displayName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="xId"
          render={({ field }) => (
            <TextInput
              label="X ID"
              placeHolder="twitter"
              leftSection="@"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.xId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="mainFighter"
          render={({ field }) => (
            <FighterSelectorInput
              label="メインファイター"
              value={field.value}
              onChange={field.onChange}
              error={errors.mainFighter?.message}
            />
          )}
        />
      </FlexBox>
      <FlexBox gap={16} align="stretch">
        <BasicButton type="submit" disabled={isSubmitting}>
          登録
        </BasicButton>
        <BasicButton importance="tertiary">
          他のGoogleアカウントを使用
        </BasicButton>
      </FlexBox>
    </form>
  )
}
