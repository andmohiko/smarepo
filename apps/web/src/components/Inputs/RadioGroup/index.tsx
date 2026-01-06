import { Radio } from '@mantine/core'

import style from './style.module.css'

type Option = {
  label: string
  value: string
}

type Props = {
  label?: React.ReactNode
  options: Array<Option>
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  error?: React.ReactNode
}

export const RadioGroup = ({
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
}: Props) => {
  return (
    <Radio.Group
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
    >
      <div className={style.radioGroup}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            variant="outline"
            color="black"
            size="md"
            className={style.radio}
            classNames={{
              radio: style.radioButton,
            }}
          />
        ))}
      </div>
    </Radio.Group>
  )
}
