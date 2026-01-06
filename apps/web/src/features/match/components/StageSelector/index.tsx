import { type OnlineStage, onlineStageOptions } from '@smarepo/common'
import { RadioGroup } from '~/components/Inputs/RadioGroup'
import { LabelText } from '~/components/Typography/LabelText'

type Props = {
  value: OnlineStage | undefined
  onChange: (value: OnlineStage) => void
  error?: React.ReactNode
}

export const StageSelector = ({
  value,
  onChange,
  error,
}: Props): React.ReactNode => {
  return (
    <RadioGroup
      label={
        <LabelText size="sm" weight="bold">
          ステージ
        </LabelText>
      }
      options={Object.entries(onlineStageOptions).map(([value, label]) => ({
        value,
        label,
      }))}
      value={value}
      onChange={(value) => onChange(value as OnlineStage)}
      error={error}
    />
  )
}
