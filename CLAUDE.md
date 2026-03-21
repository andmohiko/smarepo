# スマレポ - Firestore実装ガイド

このドキュメントは、スマレポアプリケーションで採用しているFirestoreの実装パターンとルールをまとめたものです。他のプロジェクトでも参照できるように、型定義、DB通信、カスタムフックなどの実装ルールを記載しています。

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [アーキテクチャ概要](#2-アーキテクチャ概要)
3. [型定義のルール](#3-型定義のルール)
4. [DB操作の実装パターン](#4-db操作の実装パターン)
5. [カスタムフックの実装パターン](#5-カスタムフックの実装パターン)
6. [ベストプラクティス](#6-ベストプラクティス)

---

## 1. プロジェクト概要

### 技術スタック
- **フロントエンド**: Next.js, TypeScript
- **データベース**: Cloud Firestore
- **認証**: Firebase Authentication
- **パッケージ管理**: pnpm, turborepo

### プロジェクト構成
```
smarepo/
├── apps/
│   ├── web/              # Next.jsアプリケーション
│   └── functions/        # Firebase Functions
├── packages/
│   └── common/           # 共通の型定義・エンティティ
└── docs/                 # ドキュメント
```

---

## 2. アーキテクチャ概要

### レイヤー構造

```
UI Layer (React Components)
    ↓
Hooks Layer (Custom Hooks)
    ↓
Operations Layer (Firestore Operations)
    ↓
Types Layer (Entity Types & DTOs)
    ↓
Firestore
```

### 責務分離

| レイヤー | 責務 | ディレクトリ |
|---------|------|------------|
| **Entity Types** | データ型定義、DTO定義 | `packages/common/src/entities/` |
| **Operations** | Firestore CRUD操作 | `apps/web/src/infrastructure/firestore/` |
| **Hooks** | React統合、状態管理 | `apps/web/src/hooks/`, `apps/web/src/features/*/hooks/` |
| **Components** | UI表示 | `apps/web/src/components/`, `apps/web/src/features/*/components/` |

---

## 3. 型定義のルール

### 3.1 基本構造

各エンティティは以下の3種類の型を定義します：

1. **Entity型**: Firestoreから取得したデータを表す型
2. **CreateDto**: 新規作成時のデータ型
3. **UpdateDto**: 更新時のデータ型

### 3.2 実装例

#### Profile.ts（プロフィールエンティティ）

```typescript
import type { FieldValue } from 'firebase/firestore'
import type { UserId } from './User'

// コレクション名を定数として定義
export const profileCollection = 'profiles' as const

// ID型のエイリアス
export type ProfileId = UserId

// メインのEntity型（Firestoreから取得したデータ）
export type Profile = {
  profileId: ProfileId
  createdAt: Date            // Firestoreから取得時はDateに変換済み
  displayName: string
  friendCode: string
  isPrivateProfile: boolean
  mainFighterIds: Array<string>
  mainPlayingTime: string
  ogpImageUrl: string | null
  profileImageUrl: string
  selfIntroduction: string
  smashMateMaxRating: number | null
  updatedAt: Date
  username: string
  voiceChat: VoiceChat
  xId: string
}

// 作成用DTO（IDとタイムスタンプを除く）
export type CreateProfileDto = Omit<
  Profile,
  'profileId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue      // serverTimestamp()を使用
  updatedAt: FieldValue
}

// 更新用DTO（更新可能なフィールドのみ）
export type UpdateProfileDto = {
  displayName: Profile['displayName']
  friendCode: Profile['friendCode']
  isPrivateProfile: Profile['isPrivateProfile']
  mainFighterIds: Profile['mainFighterIds']
  mainPlayingTime: Profile['mainPlayingTime']
  profileImageUrl: Profile['profileImageUrl']
  selfIntroduction: Profile['selfIntroduction']
  smashMateMaxRating: Profile['smashMateMaxRating']
  updatedAt: FieldValue      // serverTimestamp()を使用
  username: Profile['username']
  voiceChat: Profile['voiceChat']
  xId: Profile['xId']
}

// シリアライズ用型（API経由でやり取りする場合）
export type SerializedProfile = Omit<Profile, 'createdAt' | 'updatedAt'> & {
  createdAt: string | null
  updatedAt: string | null
}
```

#### PublicMatch.ts（戦績エンティティ）

```typescript
import type { FieldValue } from 'firebase/firestore'
import type { DocId } from './Auth'
import type { OnlineStage, Result } from './Match'
import type { UserId } from './User'

export const publicMatchCollection = 'publicMatches' as const

export type PublicMatchId = DocId

export type PublicMatch = {
  publicMatchId: PublicMatchId
  createdAt: Date
  isContinuedMatch: boolean
  isElite: boolean
  globalSmashPower: number | null
  myFighterId: string
  myFighterName: string
  opponentFighterId: string
  opponentFighterName: string
  result: Result
  stage: OnlineStage | null
  updatedAt: Date
  userId: UserId
}

export type CreatePublicMatchDto = Omit<
  PublicMatch,
  'publicMatchId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

// 更新DTOでは全フィールドをオプショナルに
export type UpdatePublicMatchDto = {
  isContinuedMatch?: PublicMatch['isContinuedMatch']
  isElite?: PublicMatch['isElite']
  globalSmashPower?: PublicMatch['globalSmashPower']
  myFighterId?: PublicMatch['myFighterId']
  myFighterName?: PublicMatch['myFighterName']
  opponentFighterId?: PublicMatch['opponentFighterId']
  opponentFighterName?: PublicMatch['opponentFighterName']
  result?: PublicMatch['result']
  stage?: PublicMatch['stage']
  updatedAt: FieldValue      // updatedAtのみ必須
}
```

### 3.3 型定義のルール

1. **コレクション名は定数で定義**
   ```typescript
   export const profileCollection = 'profiles' as const
   ```

2. **ID型はエイリアスを使用**
   ```typescript
   export type ProfileId = UserId
   export type PublicMatchId = DocId
   ```

3. **Entity型のタイムスタンプはDate型**
   - Firestoreから取得したデータは`Date`型に変換済みとして扱う

4. **DTO型のタイムスタンプはFieldValue型**
   - `serverTimestamp()`を使用するため`FieldValue`型を使用

5. **CreateDtoではIDとタイムスタンプを除外**
   ```typescript
   Omit<Entity, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: FieldValue, updatedAt: FieldValue }
   ```

6. **UpdateDtoでは更新可能なフィールドのみ定義**
   - `updatedAt`は必須、その他は必要に応じてオプショナルに

---

## 4. DB操作の実装パターン

### 4.1 Operations層の役割

- Firestoreへの直接アクセスをカプセル化
- CRUD操作を提供
- リアルタイム購読機能を提供
- エラーハンドリングは上位層（Hooks）に委譲

### 4.2 実装パターン

#### 4.2.1 基本的なCRUD操作

**ProfileOperations.ts**

```typescript
import type {
  CreateProfileDto,
  Profile,
  ProfileId,
  UpdateProfileDto,
} from '@smarepo/common'
import { profileCollection } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

// 日付変換が必要なカラムを定義
const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

// 1. クエリによる取得（username検索）
export const fetchProfileByUsernameOperation = async (
  username: Profile['username'],
): Promise<Profile | null> => {
  const snapshot = await getDocs(
    query(
      collection(db, profileCollection),
      where('username', '==', username),
      limit(1),
    ),
  )
  if (snapshot.size === 0) {
    return null
  }
  const data = snapshot.docs[0].data()
  return {
    profileId: snapshot.docs[0].id,
    ...convertDate(data, dateColumns),
  } as Profile
}

// 2. リアルタイム購読（IDによる取得）
export const subscribeProfileOperation = (
  profileId: string,
  setter: (profile: Profile | null | undefined) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    doc(db, profileCollection, profileId),
    (snapshot) => {
      const data = snapshot.data()
      if (!data) {
        setter(null)
        return
      }
      const profile = {
        profileId: snapshot.id,
        ...convertDate(data, dateColumns),
      } as Profile
      setter(profile)
      return
    },
  )
  return unsubscribe
}

// 3. 作成（setDocを使用、IDを指定）
export const createProfileOperation = async (
  profileId: ProfileId,
  dto: CreateProfileDto,
): Promise<void> => {
  await setDoc(doc(db, profileCollection, profileId), dto)
}

// 4. 更新
export const updateProfileOperation = async (
  profileId: ProfileId,
  dto: UpdateProfileDto,
): Promise<void> => {
  await updateDoc(doc(db, profileCollection, profileId), dto)
}

// 5. 存在チェック
export const isExistsProfileOperation = async (
  userId: string,
): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, profileCollection, userId))
  return docSnap.exists()
}
```

#### 4.2.2 ページネーション実装

**PublicMatchOperations.ts**

```typescript
import type {
  CreatePublicMatchDto,
  PublicMatch,
  PublicMatchId,
  UpdatePublicMatchDto,
} from '@smarepo/common'
import { publicMatchCollection } from '@smarepo/common'
import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

// 1ページあたりの取得件数を定数で定義
export const PUBLIC_MATCHES_PAGE_SIZE = 50

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

// ドキュメント変換ユーティリティ
const convertToPublicMatch = (docSnapshot: DocumentSnapshot): PublicMatch => {
  const data = docSnapshot.data()
  if (!data) {
    throw new Error('データが存在しません')
  }
  return {
    publicMatchId: docSnapshot.id,
    ...convertDate(data, dateColumns),
  } as PublicMatch
}

// 1. リアルタイム購読（最初のページ用）
export const subscribePublicMatchesOperation = (
  userId: string,
  pageSize: number,
  setter: (matches: Array<PublicMatch>) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, publicMatchCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    ),
    (snapshot) => {
      const publicMatches = snapshot.docs.map(convertToPublicMatch)
      setter(publicMatches)
    },
  )
  return unsubscribe
}

// ページネーション取得結果の型定義
export type FetchPublicMatchesResult = {
  matches: Array<PublicMatch>
  lastDoc: DocumentSnapshot | null  // カーソル
  hasMore: boolean
}

// 2. ページネーション取得（追加読み込み用）
export const fetchPublicMatchesOperation = async (
  userId: string,
  pageSize: number,
  lastDocument: DocumentSnapshot | null,
): Promise<FetchPublicMatchesResult> => {
  // クエリ条件を構築
  const baseConstraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ]

  // カーソルがある場合はstartAfterを追加
  const constraints = lastDocument
    ? [...baseConstraints, startAfter(lastDocument), limit(pageSize)]
    : [...baseConstraints, limit(pageSize)]

  const snapshot = await getDocs(
    query(collection(db, publicMatchCollection), ...constraints),
  )

  const matches = snapshot.docs.map(convertToPublicMatch)
  const lastDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null
  const hasMore = snapshot.docs.length === pageSize

  return { matches, lastDoc, hasMore }
}

// 3. 作成（addDocを使用、自動ID生成）
export const createPublicMatchOperation = async (
  dto: CreatePublicMatchDto,
): Promise<void> => {
  await addDoc(collection(db, publicMatchCollection), dto)
}

// 4. 更新
export const updatePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
  dto: UpdatePublicMatchDto,
): Promise<void> => {
  await updateDoc(doc(db, publicMatchCollection, publicMatchId), dto)
}

// 5. 削除
export const deletePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
): Promise<void> => {
  await deleteDoc(doc(db, publicMatchCollection, publicMatchId))
}
```

### 4.3 Operations実装のルール

1. **関数名の命名規則**
   - 取得: `fetch*Operation`
   - 購読: `subscribe*Operation`
   - 作成: `create*Operation`
   - 更新: `update*Operation`
   - 削除: `delete*Operation`
   - 存在チェック: `isExists*Operation`

2. **戻り値の型**
   - `fetch`: `Promise<Entity | null>` または `Promise<Array<Entity>>`
   - `subscribe`: `Unsubscribe`（購読解除関数）
   - `create/update/delete`: `Promise<void>`
   - `isExists`: `Promise<boolean>`

3. **日付カラムの変換**
   ```typescript
   const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>
   const entity = {
     id: snapshot.id,
     ...convertDate(data, dateColumns),
   } as Entity
   ```

4. **ページネーション実装**
   - カーソルベースのページネーションを使用
   - `DocumentSnapshot`をカーソルとして返す
   - `hasMore`フラグで追加データの有無を返す

5. **IDの扱い**
   - `setDoc`を使用する場合: IDを引数で受け取る
   - `addDoc`を使用する場合: Firestoreが自動生成

---

## 5. カスタムフックの実装パターン

### 5.1 Hooks層の役割

- Operations層をReactコンポーネントで使いやすい形に変換
- 状態管理（useState, useEffect）
- エラーハンドリング
- 認証情報の取得
- ローディング状態の管理

### 5.2 実装パターン

#### 5.2.1 データ取得フック（リアルタイム購読 + ページネーション）

**usePublicMatches.ts**

```typescript
import type { PublicMatch } from '@smarepo/common'
import type { DocumentSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { useToast } from '~/hooks/useToast'
import {
  fetchPublicMatchesOperation,
  PUBLIC_MATCHES_PAGE_SIZE,
  subscribePublicMatchesOperation,
} from '~/infrastructure/firestore/PublicMatchOperations'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'
import { errorMessage } from '~/utils/errorMessage'

// 戻り値の型を定義
export type UsePublicMatchesReturn = {
  matches: Array<PublicMatch>
  error: string | null
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  loadMore: () => Promise<void>
}

export const usePublicMatches = (): UsePublicMatchesReturn => {
  const { uid } = useFirebaseAuthContext()
  const { showErrorToast } = useToast()

  // 最初のページ（リアルタイム購読分）
  const [firstPageMatches, setFirstPageMatches] = useState<Array<PublicMatch>>([])
  // 追加読み込み分の戦績
  const [additionalMatches, setAdditionalMatches] = useState<Array<PublicMatch>>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 初回読み込み完了フラグ
  const isInitialLoadDoneRef = useRef<boolean>(false)
  // 追加読み込み用のカーソル
  const lastDocRef = useRef<DocumentSnapshot | null>(null)

  // 追加データを取得する関数
  const fetchMore = useCallback(
    async (
      cursor: DocumentSnapshot | null,
    ): Promise<{ cursor: DocumentSnapshot | null; hasMore: boolean }> => {
      if (!uid) {
        return { cursor: null, hasMore: false }
      }

      const result = await fetchPublicMatchesOperation(
        uid,
        PUBLIC_MATCHES_PAGE_SIZE,
        cursor,
      )

      // 重複を排除して追加
      const existingIds = new Set([
        ...firstPageMatches.map((m) => m.publicMatchId),
        ...additionalMatches.map((m) => m.publicMatchId),
      ])
      const newMatches = result.matches.filter(
        (m) => !existingIds.has(m.publicMatchId),
      )

      setAdditionalMatches((prev) => [...prev, ...newMatches])
      lastDocRef.current = result.lastDoc

      return {
        cursor: result.lastDoc,
        hasMore: result.hasMore,
      }
    },
    [uid, firstPageMatches, additionalMatches],
  )

  // エラーハンドリング
  const handleError = useCallback(
    (e: unknown): void => {
      setError(errorMessage(e))
      showErrorToast('追加データの取得に失敗しました')
    },
    [showErrorToast],
  )

  // 無限スクロール用のフック
  const { isLoadingMore, hasMore, loadMore, reset } =
    useInfiniteScroll<DocumentSnapshot>({
      initialDataLength: firstPageMatches.length,
      pageSize: PUBLIC_MATCHES_PAGE_SIZE,
      fetchMore,
      onError: handleError,
    })

  // 最初のページをリアルタイム購読する
  useEffect(() => {
    if (!uid) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const unsubscribe = subscribePublicMatchesOperation(
        uid,
        PUBLIC_MATCHES_PAGE_SIZE,
        (matches) => {
          setFirstPageMatches(matches)
          setIsLoading(false)
          isInitialLoadDoneRef.current = true
        },
      )
      return () => unsubscribe()
    } catch (e) {
      setError(errorMessage(e))
      showErrorToast('公開試合の取得に失敗しました', '再度ログインしてください')
      setIsLoading(false)
    }
  }, [showErrorToast, uid])

  // firstPageMatchesが更新されたら追加読み込み分をリセット
  useEffect(() => {
    if (isInitialLoadDoneRef.current) {
      setAdditionalMatches([])
      lastDocRef.current = null
      reset(firstPageMatches.length)
    }
  }, [firstPageMatches, reset])

  // リアルタイム購読分と追加読み込み分を結合
  const matches = [...firstPageMatches, ...additionalMatches]

  return {
    matches,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  }
}
```

#### 5.2.2 ミューテーションフック（作成・更新）

**useCreatePublicMatchMutation.ts**

```typescript
import { type FighterId, fighters } from '@smarepo/common'
import type { EditPublicMatchInputType } from '~/features/match/types'
import { createPublicMatchOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '~/lib/firebase'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const useCreatePublicMatchMutation = () => {
  const { uid } = useFirebaseAuthContext()

  const createPublicMatch = async (data: EditPublicMatchInputType) => {
    // 認証チェック
    if (!uid) {
      throw new Error('ログインし直してください')
    }

    // データ変換とバリデーション
    await createPublicMatchOperation({
      createdAt: serverTimestamp,
      isContinuedMatch: data.isContinuedMatch,
      isElite: data.isElite,
      // globalSmashPowerは万単位で表示しているため、内部では10000倍する
      globalSmashPower: data.globalSmashPower
        ? data.globalSmashPower * 10000
        : null,
      myFighterId: data.myFighterId!,
      // ファイター名はIDから取得
      myFighterName: fighters[data.myFighterId as FighterId].name,
      opponentFighterId: data.opponentFighterId!,
      opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
      result: data.result!,
      stage: data.stage ? data.stage : null,
      updatedAt: serverTimestamp,
      userId: uid,
    })
  }

  return { createPublicMatch }
}
```

**useUpdatePublicMatchMutation.ts**

```typescript
import { type FighterId, fighters, type PublicMatchId } from '@smarepo/common'
import type { EditPublicMatchInputType } from '~/features/match/types'
import { updatePublicMatchOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { serverTimestamp } from '~/lib/firebase'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const useUpdatePublicMatchMutation = () => {
  const { uid } = useFirebaseAuthContext()

  const updatePublicMatch = async (
    publicMatchId: PublicMatchId,
    data: EditPublicMatchInputType,
  ) => {
    if (!uid) {
      throw new Error('ログインし直してください')
    }

    await updatePublicMatchOperation(publicMatchId, {
      isContinuedMatch: data.isContinuedMatch,
      isElite: data.isElite,
      globalSmashPower: data.globalSmashPower
        ? data.globalSmashPower * 10000
        : null,
      myFighterId: data.myFighterId!,
      myFighterName: fighters[data.myFighterId as FighterId].name,
      opponentFighterId: data.opponentFighterId!,
      opponentFighterName: fighters[data.opponentFighterId as FighterId].name,
      result: data.result!,
      stage: data.stage ? data.stage : null,
      updatedAt: serverTimestamp,
    })
  }

  return { updatePublicMatch }
}
```

### 5.3 Hooks実装のルール

1. **命名規則**
   - データ取得: `use{EntityName}` (例: `usePublicMatches`)
   - ミューテーション: `use{Action}{EntityName}Mutation` (例: `useCreatePublicMatchMutation`)

2. **戻り値の型定義**
   ```typescript
   export type UsePublicMatchesReturn = {
     // 戻り値の型を明示的に定義
   }
   export const usePublicMatches = (): UsePublicMatchesReturn => { }
   ```

3. **必須のコンテキスト**
   - `useFirebaseAuthContext()`: 認証情報の取得
   - `useToast()`: エラーメッセージ表示

4. **エラーハンドリング**
   ```typescript
   try {
     // Firestore操作
   } catch (e) {
     setError(errorMessage(e))
     showErrorToast('エラーメッセージ')
   }
   ```

5. **リアルタイム購読のクリーンアップ**
   ```typescript
   useEffect(() => {
     const unsubscribe = subscribeOperation(setter)
     return () => unsubscribe()  // クリーンアップ
   }, [deps])
   ```

6. **ミューテーションフックの構造**
   - 認証チェックを必ず実施
   - データ変換を行う（表示用 → 保存用）
   - エラーは上位でハンドリングできるようthrowする

---

## 6. ベストプラクティス

### 6.1 Firebase設定

**apps/web/src/lib/firebase.ts**

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  serverTimestamp as getServerTimeStamp,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp({ ...config })

const auth = getAuth(firebaseApp)
auth.languageCode = 'ja'

const db = getFirestore(firebaseApp)
const serverTimestamp = getServerTimeStamp()

const storage = getStorage(firebaseApp)

// エミュレーター接続（開発環境）
if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export { auth, db, serverTimestamp, storage }
```

### 6.2 日付変換ユーティリティ

**apps/web/src/utils/convertDate.ts**

```typescript
import type { Timestamp } from 'firebase/firestore'

/**
 * FirestoreのTimestamp型をDate型に変換するユーティリティ
 * @param data - Firestoreから取得したデータ
 * @param dateColumns - 変換対象のカラム名配列
 * @returns 変換後のデータ
 */
export const convertDate = <T extends Record<string, unknown>>(
  data: T,
  dateColumns: ReadonlyArray<string>,
): T => {
  const result = { ...data }
  dateColumns.forEach((column) => {
    if (result[column] && typeof result[column] === 'object') {
      result[column] = (result[column] as Timestamp).toDate()
    }
  })
  return result
}
```

使用例：
```typescript
const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>
const profile = {
  profileId: snapshot.id,
  ...convertDate(data, dateColumns),
} as Profile
```

### 6.3 ディレクトリ構成

```
apps/web/src/
├── components/              # 共通UIコンポーネント
├── features/                # 機能別ディレクトリ
│   ├── match/
│   │   ├── components/     # 戦績関連のコンポーネント
│   │   ├── hooks/          # 戦績関連のカスタムフック
│   │   └── types/          # 戦績関連の型定義
│   ├── profile/
│   └── register/
├── hooks/                   # 汎用カスタムフック
├── infrastructure/          # インフラ層
│   └── firestore/          # Firestore操作
│       ├── ProfileOperations.ts
│       ├── PublicMatchOperations.ts
│       └── ...
├── lib/                     # ライブラリ初期化
│   └── firebase.ts
├── providers/               # React Context Provider
│   └── FirebaseAuthProvider.tsx
└── utils/                   # ユーティリティ関数
    ├── convertDate.ts
    └── errorMessage.ts

packages/common/src/
└── entities/                # エンティティ型定義
    ├── Auth.ts
    ├── Match.ts
    ├── Profile.ts
    ├── PublicMatch.ts
    ├── User.ts
    └── ...
```

### 6.4 コーディング規約

1. **型の完全性**
   - `any`型は使用しない
   - 戻り値の型は明示的に定義する
   - DTOは必ず定義する

2. **エラーハンドリング**
   - Operations層ではエラーをthrowする
   - Hooks層でcatch&ログ出力
   - ユーザーにはトースト通知で伝える

3. **命名規則**
   - コレクション名: 小文字キャメルケース（例: `publicMatches`）
   - 型名: パスカルケース（例: `PublicMatch`）
   - 関数名: キャメルケース（例: `createPublicMatchOperation`）

4. **コメント**
   - 関数にはJSDocコメントを記載
   - 複雑なロジックには日本語コメントを記載

5. **定数管理**
   - ページサイズなどは定数として定義
   ```typescript
   export const PUBLIC_MATCHES_PAGE_SIZE = 50
   ```

### 6.5 セキュリティ

1. **Firestore Security Rules**
   - 必ず認証チェックを実装
   - スキーマバリデーションを実装
   - 所有権チェックを実装

2. **クライアント側**
   - 認証情報の確認を必ず行う
   - センシティブな情報はログに出力しない

### 6.6 パフォーマンス

1. **データ取得の最適化**
   - 必要なデータのみ取得
   - ページネーションを実装
   - リアルタイム購読は最小限に

2. **キャッシュ活用**
   - Firestoreのキャッシュを活用
   - 不要なリアルタイム購読は解除

3. **インデックス**
   - 複合クエリには必ずインデックスを設定
   - `firestore.indexes.json`で管理

---

## まとめ

このガイドで示した実装パターンを採用することで、以下のメリットが得られます：

- **型安全性**: TypeScriptの型システムを最大限活用
- **保守性**: レイヤー分離により責務が明確
- **再利用性**: Operations層とHooks層を分離することで再利用が容易
- **テスタビリティ**: 各層が独立しているためテストが書きやすい
- **スケーラビリティ**: 機能追加時に既存コードへの影響を最小化

他のプロジェクトでFirestoreを使用する際も、このパターンを参考にすることで、一貫性のある実装が可能になります。
