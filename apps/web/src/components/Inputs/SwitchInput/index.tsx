import { Switch as MantineSwitch } from '@mantine/core'

type Props = {
  label?: React.ReactNode
  value?: boolean
  onChange?: (value: boolean) => void
}

export const SwitchInput = ({ label, value, onChange }: Props) => {
  return (
    <MantineSwitch
      checked={value ?? false}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      label={label}
      size="md"
    />
  )
}
