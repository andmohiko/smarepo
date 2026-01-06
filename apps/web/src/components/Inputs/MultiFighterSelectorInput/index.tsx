import type { FighterId } from '@smarepo/common'
import { useState } from 'react'
import { FlexBox } from '~/components/Base/FlexBox'
import { UnstyledButton } from '~/components/Buttons/UnstyledButton'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

/**
 * ファイター選択項目の型
 */
type FighterSelectorItem = {
  id: string
  fighterId?: FighterId
}

/**
 * ファイター複数選択コンポーネント
 *
 * @remarks
 * - 複数のファイターを選択可能
 * - 各ファイター選択には既存のFighterSelectorInputを使用
 * - 「ファイターを追加する」ボタンで新しい選択を追加
 * - 各選択には削除ボタンを表示
 * - 選択時に親コンポーネントにコールバックを通知
 *
 * @param label - コンポーネントのタイトル
 * @param isShowName - ファイター名を表示するか（デフォルト: false）
 * @param value - 選択されたファイターIDの配列
 * @param onChange - ファイターが選択された際のコールバック関数
 */
type Props = {
  label?: string
  isShowName?: boolean
  value?: Array<FighterId>
  onChange?: (value: Array<FighterId>) => void
}

/**
 * 一意のIDを生成する関数
 *
 * @returns 一意のID文字列
 */
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const MultiFighterSelectorInput = ({
  value = [],
  label,
  isShowName = false,
  onChange,
}: Props): React.ReactNode => {
  /**
   * 内部で管理するファイター選択項目の配列
   * 各項目には一意のIDと選択されたファイターIDを含む
   */
  const [fighterSelectors, setFighterSelectors] = useState<
    Array<FighterSelectorItem>
  >(() => {
    if (value.length > 0) {
      return value.map((fighterId) => ({
        id: generateUniqueId(),
        fighterId,
      }))
    }
    return [{ id: generateUniqueId(), fighterId: undefined }]
  })

  /**
   * ファイターを追加するハンドラ
   * 新しい空の選択を配列に追加
   */
  const handleAddFighter = (): void => {
    const newSelectors = [
      ...fighterSelectors,
      { id: generateUniqueId(), fighterId: undefined },
    ]
    setFighterSelectors(newSelectors)
  }

  /**
   * 指定されたIDのファイターを削除するハンドラ
   *
   * @param id - 削除するファイター選択項目のID
   */
  const handleRemoveFighter = (id: string): void => {
    const newSelectors = fighterSelectors.filter((item) => item.id !== id)
    // すべて削除された場合は、空の選択を1つ残す
    if (newSelectors.length === 0) {
      const emptySelector = [{ id: generateUniqueId(), fighterId: undefined }]
      setFighterSelectors(emptySelector)
      onChange?.([])
      return
    }
    setFighterSelectors(newSelectors)
    // undefinedを除外して親コンポーネントに通知
    const filteredIds = newSelectors
      .map((item) => item.fighterId)
      .filter((id): id is FighterId => id !== undefined)
    onChange?.(filteredIds)
  }

  /**
   * 指定されたIDのファイターが変更された際のハンドラ
   *
   * @param id - 変更されたファイター選択項目のID
   * @param fighterId - 選択されたファイターID（undefinedの場合は選択解除）
   */
  const handleFighterChange = (
    id: string,
    fighterId: FighterId | undefined,
  ): void => {
    const newSelectors = fighterSelectors.map((item) =>
      item.id === id ? { ...item, fighterId } : item,
    )
    setFighterSelectors(newSelectors)
    // undefinedを除外して親コンポーネントに通知
    const filteredIds = newSelectors
      .map((item) => item.fighterId)
      .filter((id): id is FighterId => id !== undefined)
    onChange?.(filteredIds)
  }

  return (
    <div className={styles.multiFighterSelectorInput}>
      {label && (
        <FlexBox direction="row" justify="space-between" mb={8}>
          <LabelText weight="bold">{label}</LabelText>
        </FlexBox>
      )}
      {fighterSelectors.map((selector, index) => (
        <div key={selector.id} className={styles.fighterSelectorWrapper}>
          <FlexBox
            direction="row"
            justify="space-between"
            align="center"
            mb={8}
          >
            <LabelText weight="normal" size="sm">
              ファイター {index + 1}
            </LabelText>
            {fighterSelectors.length > 1 && (
              <UnstyledButton onClick={() => handleRemoveFighter(selector.id)}>
                <span className={styles.removeButtonText}>削除</span>
              </UnstyledButton>
            )}
          </FlexBox>
          <FighterSelectorInput
            value={selector.fighterId}
            isShowName={isShowName}
            onChange={(selectedFighterId) =>
              handleFighterChange(selector.id, selectedFighterId)
            }
          />
        </div>
      ))}
      <div className={styles.addButtonWrapper}>
        <UnstyledButton onClick={handleAddFighter}>
          <span className={styles.addButtonText}>使用ファイターを追加する</span>
        </UnstyledButton>
      </div>
    </div>
  )
}
