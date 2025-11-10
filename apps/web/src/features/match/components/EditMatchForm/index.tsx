import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PublicMatch, Result } from '@smarepo/common'

import styles from './style.module.scss'

import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import type { EditPublicMatchInputType } from '~/features/match/types'
import { editPublicMatchSchema } from '~/features/match/types'
import { useToast } from '~/hooks/useToast'
import { ResultInput } from '~/features/match/components/ResultInput'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { CheckboxInput } from '~/components/Inputs/Checkboxes'
import { NumberInput } from '~/components/Inputs/NumberInput'

type Props = {
  onClose: () => void
  defaultValues?: PublicMatch
}

export const EditMatchForm = ({
  onClose,
  defaultValues,
}: Props): React.ReactElement => {
  const { showErrorToast } = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditPublicMatchInputType>({
    resolver: zodResolver(editPublicMatchSchema),
    defaultValues: defaultValues
      ? {
          isContinuedMatch: defaultValues.isContinuedMatch,
          isElite: defaultValues.isElite,
          globalSmashPower: defaultValues.globalSmashPower,
          myFighterId: defaultValues.myFighterId,
          opponentFighterId: defaultValues.opponentFighterId,
          result: defaultValues.result,
        }
      : {
          isContinuedMatch: false,
          isElite: false,
          globalSmashPower: undefined,
          myFighterId: undefined,
          opponentFighterId: undefined,
          result: undefined,
        },
  })

  const onSubmit = async (data: EditPublicMatchInputType) => {
    try {
      console.log('data', data)
      // if (defaultValues) {
      //   await updatePublicMatch(defaultValues.publicMatchId, data)
      // } else {
      //   await createPublicMatch(data)
      // }
      onClose()
    } catch {
      showErrorToast('戦績の作成に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.editMatchForm}>
      <FlexBox gap={32} align="stretch">
        <Controller
          name="myFighterId"
          control={control}
          render={({ field }) => (
            <FighterSelectorInput
              label="自分のファイター"
              value={field.value}
              onChange={field.onChange}
              error={errors.myFighterId?.message}
            />
          )}
        />
        <Controller
          name="opponentFighterId"
          control={control}
          render={({ field }) => (
            <FighterSelectorInput
              label="相手のファイター"
              value={field.value}
              onChange={field.onChange}
              error={errors.opponentFighterId?.message}
            />
          )}
        />
        <Controller
          name="result"
          control={control}
          render={({ field }) => (
            <ResultInput
              value={field.value}
              onChange={field.onChange}
              error={errors.result?.message}
            />
          )}
        />
        <FlexBox direction="row" justify="flex-start" gap={32}>
          <Controller
            name="isElite"
            control={control}
            render={({ field }) => (
              <CheckboxInput
                label="VIPマッチ"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="isContinuedMatch"
            control={control}
            render={({ field }) => (
              <CheckboxInput
                label="連戦だった"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FlexBox>
        <Controller
          name="globalSmashPower"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="世界戦闘力"
              value={field.value}
              onChange={field.onChange}
              placeHolder="1429"
              rightSection={<>万</>}
              width="150px"
              error={errors.globalSmashPower?.message}
            />
          )}
        />
      </FlexBox>
      <BasicButton type="submit" disabled={!isValid} loading={isSubmitting}>
        保存
      </BasicButton>
    </form>
  )
}
