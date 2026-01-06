import { NumberInput as MantineNumberInput } from '@mantine/core'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type Props = {
  label?: React.ReactNode
  placeHolder?: string
  value?: number
  onChange?: () => void
  onBlur?: () => void
  error?: React.ReactNode
  width?: string
  rightSection?: React.ReactNode
}

export const NumberInput = ({
  label,
  placeHolder,
  value,
  onChange,
  onBlur,
  error,
  width = '100%',
  rightSection,
}: Props): React.ReactNode => {
  return (
    <MantineNumberInput
      label={
        label ? (
          <LabelText size="sm" weight="bold">
            {label}
          </LabelText>
        ) : undefined
      }
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      w={width}
      rightSection={rightSection}
      classNames={{
        label: styles.label,
      }}
    />
  )
}
