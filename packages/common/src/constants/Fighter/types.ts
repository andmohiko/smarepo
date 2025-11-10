/**
 * @file fighters.ts
 * @description ファイターの定義を管理する定数ファイル
 */

/**
 * ファイターのIDの型定義
 */
export type FighterId = string

/**
 * ファイターの型定義
 * @remarks
 * fighters.jsonの各要素に対応する型定義
 * 親子関係や兄弟関係を持つファイターの情報を含む
 */
export type Fighter = {
  /** ファイターのID（例: "01", "04e"） */
  fighterId: FighterId
  /** ファイターのアイコンファイル名（例: "01_Mario.png"） */
  icon: string
  /** ダッシュファイターかどうか（エコーファイターかどうか） */
  isDashFighter: boolean
  /** ダッシュファイター（エコーファイター）を持っているかどうか */
  hasDashFighter: boolean
  /** 兄弟ファイターを持っているかどうか */
  hasSiblingFighter: boolean
  /** ファイターの名前（日本語） */
  name: string
  /** ファイターのニックネーム */
  nickname: string
  /** ファイターの名前（英語） */
  name_en: string
  /** ファイターの番号（同じ番号を持つファイターは関連がある） */
  number: number
  /** 親ファイターのID（エコーファイターの場合、元のファイターのID） */
  parent: FighterId | null
  /** 子ファイターのID（エコーファイターが存在する場合、そのID） */
  child: FighterId | null
  /** DLCファイターかどうか */
  isDlc: boolean
}

/**
 * ファイターデータの全体を表す型定義
 * @remarks
 * fighterIdをキーとして、Fighterオブジェクトを値として持つレコード型
 */
export type FightersData = Record<FighterId, Fighter>
