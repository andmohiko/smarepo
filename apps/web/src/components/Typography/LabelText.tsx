import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor } from './types'

type Props = {
  children: React.ReactNode
  weight?: 'normal' | 'bold'
  size?: FontSizes
  color?: TextColor
}

export const LabelText = ({
  children,
  weight = 'normal',
  size = 'md',
  color = 'black',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'lg') {
      return 20
    }
    if (size === 'sm') {
      return 14
    }
    if (size === 'xs') {
      return 12
    }
    return 16
  }

  return (
    <span
      className={classNames(
        styles.labelText,
        styles[`_${color}`],
        styles[`_size${getFontSize(size)}`],
        styles[`_${weight}`],
      )}
    >
      {children}
    </span>
  )
}
