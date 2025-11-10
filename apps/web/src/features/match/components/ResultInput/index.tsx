import type { Result } from '@smarepo/common'
import classNames from 'classnames'

import styles from './style.module.css'

/**
 * 戦績の勝敗を選択するためのコンポーネント
 *
 * @remarks
 * - 勝ち/負けの2択ボタンを表示
 * - 選択されたボタンが強調表示される
 * - 選択時に親コンポーネントにコールバックを通知
 *
 * @param previousResult - 前回の選択結果（true: 勝ち, false: 負け）。デフォルトはtrue
 * @param onClickWin - 勝ちボタンがクリックされた際のコールバック関数
 * @param onClickLose - 負けボタンがクリックされた際のコールバック関数
 */
type Props = {
  value: Result | undefined
  onChange: (value: Result) => void
}

export const ResultInput = ({ value, onChange }: Props): React.ReactNode => {
  /**
   * 勝ちボタンがクリックされた際のハンドラ
   * 内部状態をtrueに更新し、親コンポーネントに通知
   */
  const handleWinClick = (): void => {
    onChange('WIN')
  }

  /**
   * 負けボタンがクリックされた際のハンドラ
   * 内部状態をfalseに更新し、親コンポーネントに通知
   */
  const handleLoseClick = (): void => {
    onChange('LOSE')
  }

  return (
    <div className={styles.resultInput}>
      <button
        type="button"
        onClick={handleWinClick}
        className={classNames(styles.resultButton, styles.winButton, {
          [styles.winSelected]: value === 'WIN',
        })}
      >
        勝ち
      </button>
      <button
        type="button"
        onClick={handleLoseClick}
        className={classNames(styles.resultButton, styles.loseButton, {
          [styles.loseSelected]: value === 'LOSE',
        })}
      >
        負け
      </button>
    </div>
  )
}
