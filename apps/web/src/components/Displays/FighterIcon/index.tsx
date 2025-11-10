/**
 * @file FighterIcon.tsx
 * @description ファイターのアイコンを表示するコンポーネント
 * @component
 */

import classNames from 'classnames'
import Image from 'next/image'
import type { FighterId } from '@smarepo/common'
import { fighters } from '@smarepo/common'

import styles from './style.module.css'

type Props = {
  /** ファイターのID */
  fighterId: FighterId
  /** アイコンのサイズ（デフォルト: 'md'） */
  size?: 'sm' | 'md' | 'lg' | '100%'
  /** 選択状態かどうか（デフォルト: false） */
  isSelected?: boolean
}

/**
 * ファイターアイコンコンポーネント
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ファイターアイコンコンポーネント
 */
export const FighterIcon = ({
  fighterId,
  size = '100%',
  isSelected = false,
}: Props): React.ReactNode => {
  const fighterIconPath = `/fighters/${fighters[fighterId].icon}`

  return (
    <div
      className={classNames(styles.fighterIcon, styles[`_${size}`], {
        [styles.selected]: isSelected,
      })}
    >
      <Image
        src={fighterIconPath}
        alt={`Fighter ${fighterId}`}
        width={200}
        height={200}
      />
    </div>
  )
}
