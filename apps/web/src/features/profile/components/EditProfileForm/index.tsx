import { zodResolver } from '@hookform/resolvers/zod'
import type { Profile } from '@smarepo/common'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { CheckboxInput } from '~/components/Inputs/Checkboxes'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { ProfileImageInput } from '~/components/Inputs/ProfileImageInput'
import { TextArea } from '~/components/Inputs/TextArea'
import { TextInput } from '~/components/Inputs/TextInput'
import { LabelText } from '~/components/Typography/LabelText'
import { useUpdateProfileMutation } from '~/features/profile/hooks/useUpdateProfileMutation'
import {
  type EditProfileInputType,
  editProfileSchema,
} from '~/features/profile/types'
import { useToast } from '~/hooks/useToast'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { useLoadingContext } from '~/providers/LoadingProvider'
import { errorMessage } from '~/utils/errorMessage'
import styles from './style.module.css'

type Props = {
  defaultValues: Profile
}

export const EditProfileForm = ({ defaultValues }: Props): React.ReactNode => {
  const { push } = useRouter()
  const { uid } = useFirebaseAuthContext()
  const { startLoading, stopLoading } = useLoadingContext()
  const { showErrorToast, showSuccessToast } = useToast()
  const { updateProfile } = useUpdateProfileMutation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileInputType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: defaultValues.displayName,
      friendCode: defaultValues.friendCode ?? undefined,
      isPrivateProfile: defaultValues.isPrivateProfile,
      mainFighter: defaultValues.mainFighter,
      profileImageUrl: defaultValues.profileImageUrl,
      selfIntroduction: defaultValues.selfIntroduction ?? undefined,
      username: defaultValues.username,
      voiceChat: defaultValues.voiceChat,
      xId: defaultValues.xId,
    },
  })

  const onSubmit = async (data: EditProfileInputType) => {
    try {
      startLoading()
      await updateProfile(data)
      showSuccessToast('プロフィールを更新しました')
      push('/i/mypage')
    } catch (e) {
      showErrorToast(errorMessage(e))
    } finally {
      stopLoading()
    }
  }

  return (
    <form className={styles.editProfileForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.editProfileFormContent}>
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
          name="selfIntroduction"
          render={({ field }) => (
            <TextArea
              label="自己紹介"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.selfIntroduction?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="friendCode"
          render={({ field }) => (
            <TextInput
              label="フレンドコード"
              placeHolder="SW-1234-1234-1234"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.friendCode?.message}
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
        <FlexBox justify="flex-start" align="stretch" gap={8}>
          <LabelText weight="bold">ボイスチャット</LabelText>
          <FlexBox direction="row" justify="flex-start" gap={32}>
            <Controller
              control={control}
              name="voiceChat.discord"
              render={({ field }) => (
                <CheckboxInput
                  label="Discord"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="voiceChat.line"
              render={({ field }) => (
                <CheckboxInput
                  label="LINE"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="voiceChat.nintendoOnline"
              render={({ field }) => (
                <CheckboxInput
                  label="Nintendo Online"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="voiceChat.listenOnly"
              render={({ field }) => (
                <CheckboxInput
                  label="聞き専"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FlexBox>
        </FlexBox>
        <FlexBox justify="flex-start" align="stretch" gap={8}>
          <LabelText weight="bold">プロフィールの公開</LabelText>
          <Controller
            control={control}
            name="isPrivateProfile"
            render={({ field }) => (
              <CheckboxInput
                label="プロフィールを非公開にする"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FlexBox>
      </div>
      <div className={styles.editProfileFormFooter}>
        <BasicButton type="submit" disabled={isSubmitting}>
          登録
        </BasicButton>
      </div>
    </form>
  )
}
