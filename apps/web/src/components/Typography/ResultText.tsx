import classNames from 'classnames'
import type { Result } from '@smarepo/common'
import { resultLabel } from '@smarepo/common'

import styles from './style.module.css'
import type { FontSizes } from './types'

type Props = {
  result: Result
  size?: FontSizes
}

export const ResultText = ({
  result,
  size = 'md',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'xl') {
      return 20
    }
    if (size === 'lg') {
      return 16
    }
    if (size === 'sm') {
      return 12
    }
    if (size === 'xs') {
      return 10
    }
    return 14
  }

  const textClass = classNames(styles.resultText, styles[`_${result}`])

  return (
    <p
      style={{
        fontSize: getFontSize(size),
        letterSpacing: 0.07,
      }}
      className={textClass}
    >
      {resultLabel[result]}
    </p>
  )
}
