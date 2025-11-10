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
    register,
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
          globalSmashPower: 0,
          myFighterId: '',
          opponentFighterId: '',
          result: undefined,
        },
  })
  const matchResultOptions: Array<Result> = ['WIN', 'LOSE', 'DRAW']

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
          render={({ field }) => <>ファイター選択</>}
        />
        <Controller
          name="opponentFighterId"
          control={control}
          render={({ field }) => <>ファイター選択</>}
        />
        <Controller
          name="result"
          control={control}
          render={({ field }) => (
            <ResultInput value={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          name="isContinuedMatch"
          control={control}
          render={({ field }) => <>続きから</>}
        />
        <Controller
          name="isElite"
          control={control}
          render={({ field }) => <>エリート</>}
        />
        <Controller
          name="globalSmashPower"
          control={control}
          render={({ field }) => <>グローバルスマッシュパワー</>}
        />
      </FlexBox>
      <BasicButton type="submit" disabled={!isValid} loading={isSubmitting}>
        保存
      </BasicButton>
    </form>
  )
}
