import { TextInput as MantineTextInput } from '@mantine/core'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type Props = {
  label?: React.ReactNode
  description?: React.ReactNode
  placeHolder?: string
  leftSection?: React.ReactNode
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: React.ReactNode
}

export const TextInput = ({
  label,
  description,
  placeHolder,
  leftSection,
  value,
  onChange,
  onBlur,
  error,
}: Props): React.ReactNode => {
  return (
    <MantineTextInput
      label={label ? <LabelText weight="bold">{label}</LabelText> : undefined}
      description={description}
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      size="md"
      w="100%"
      leftSection={leftSection}
      classNames={{
        label: styles.label,
      }}
    />
  )
}
