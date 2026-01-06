import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor } from './types'

type Props = {
  children: React.ReactNode
  size?: FontSizes
  color?: TextColor
}

export const HeadingText = ({
  children,
  size = 'md',
  color = 'black',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'lg') {
      return 32
    }
    if (size === 'sm') {
      return 20
    }
    if (size === 'xs') {
      return 14
    }
    return 24
  }

  return (
    <span
      className={classNames(
        styles.headingText,
        styles[`_${color}`],
        styles[`_size${getFontSize(size)}`],
      )}
    >
      {children}
    </span>
  )
}
