import type { FighterId } from '@smarepo/common'
import { fighters } from '@smarepo/common'

import styles from './style.module.css'

import { FighterIcon } from '~/components/Displays/FighterIcon'
import { LabelText } from '~/components/Typography/LabelText'

/**
 * ファイター選択コンポーネント
 *
 * @remarks
 * - ファイターのアイコンをグリッド表示
 * - 使用頻度の高いファイターのみ表示するか、全ファイターを表示するかを切り替え可能
 * - 選択されたファイターを強調表示
 * - 選択時に親コンポーネントにコールバックを通知
 *
 * @param iconSize - アイコンのサイズ（デフォルト: '32px'）
 * @param usedFighterIds - 使用するファイターIDの配列。nullの場合は全ファイターを表示
 * @param label - コンポーネントのタイトル
 * @param isShowAllOption - 「全ファイターから選ぶ」ボタンを表示するか（デフォルト: false）
 * @param previouslySelected - 以前に選択されていたファイターID
 * @param isShowName - ファイター名を表示するか（デフォルト: false）
 * @param onChange - ファイターが選択された際のコールバック関数
 */
type Props = {
  label?: string
  isShowName?: boolean
  value?: FighterId | undefined
  onChange?: (fighterId: FighterId) => void
  error?: React.ReactNode
}

export const FighterSelectorInput = ({
  value,
  label,
  isShowName = false,
  onChange,
  error,
}: Props): React.ReactElement => {
  /**
   * ファイターが選択された際のハンドラ
   * 内部状態を更新し、親コンポーネントに通知
   *
   * @param fighterId - 選択されたファイターID
   */
  const handleSelect = (fighterId: FighterId): void => {
    onChange?.(fighterId)
  }

  const fightersIds = Object.keys(fighters).sort((a, b) => a.localeCompare(b))

  return (
    <div className={styles.fighterSelectorInput}>
      {label && (
        <div className={styles.label}>
          <LabelText weight="bold">{label}</LabelText>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.fighterSelector}>
        {fightersIds.map((fighterId) => (
          <div key={fighterId} className={styles.fighterIcon}>
            <button
              type="button"
              onClick={() => handleSelect(fighterId)}
              className={styles.fighterButton}
            >
              <FighterIcon
                fighterId={fighterId}
                isSelected={value === fighterId}
                size="100%"
              />
              {isShowName && (
                <span className={styles.fighterName}>
                  {fighters[fighterId].nickname}
                </span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
