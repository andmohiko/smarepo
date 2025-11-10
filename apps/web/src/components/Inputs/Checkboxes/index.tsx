import { Checkbox as MantineCheckbox } from '@mantine/core'

type Props = {
  label?: React.ReactNode
  value?: boolean
  onChange?: (value: boolean) => void
}

export const CheckboxInput = ({ label, value, onChange }: Props) => {
  return (
    <MantineCheckbox
      label={label}
      checked={value}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
    />
  )
}
