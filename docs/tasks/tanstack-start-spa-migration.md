# TanStack Start SPAモード移行計画書

## プロジェクト概要
スマレポアプリケーションをNext.jsからTanStack StartのSPAモードに移行します。

## 移行の目的
1. **パフォーマンス向上**: SPAによる高速なページ遷移
2. **バンドルサイズ削減**: Viteによる効率的なビルド
3. **開発体験の改善**: HMRの高速化とTanStack Routerの型安全性
4. **将来性**: TanStackエコシステムの活用

## 現状分析

### 既存実装（Next.js）
- **フレームワーク**: Next.js 16.1.1 (Pages Router)
- **UIライブラリ**: Mantine UI 7.17.3
- **データベース**: Firestore
- **認証**: Firebase Authentication (Google OAuth)
- **ホスティング**: Vercel

### 移行先（TanStack Start）
- **フレームワーク**: TanStack Start (SPAモード)
- **ルーティング**: TanStack Router (ファイルベース)
- **データフェッチング**: TanStack Query
- **UIライブラリ**: Tailwind CSS v4 + shadcn/ui
- **ビルドツール**: Vite 7.3.1
- **ホスティング**: Vercel/Cloudflare Pages

## 技術スタック比較

| 項目 | Next.js（現状） | TanStack Start（移行後） |
|-----|---------------|------------------------|
| **レンダリング方式** | SSR/SSG | SPA |
| **ルーティング** | Pages Router | TanStack Router |
| **データフェッチング** | useEffect + Firestore | TanStack Query |
| **状態管理** | Context API | Context API + TanStack Query |
| **UIライブラリ** | Mantine UI | Tailwind CSS + shadcn/ui |
| **フォーム管理** | react-hook-form | react-hook-form |
| **バリデーション** | Zod | Zod |
| **ビルドツール** | Webpack | Vite |
| **TypeScript** | 5.7.3 | 5.7.3 |

## 実装フェーズ詳細

### フェーズ1: 基盤構築（優先度: 高）

#### 1.1 プロジェクト初期設定
- [x] TanStack Start SPAモード確認
- [ ] 環境変数設定（.env.local作成）
- [ ] TypeScript設定の調整
- [ ] パス解決設定（@smarepo/common）

#### 1.2 Firebase統合
```typescript
// src/lib/firebase.ts
- Firebase SDK初期化
- 認証設定（auth.languageCode = 'ja'）
- Firestore接続
- Storage接続
- エミュレーター設定（開発環境）
```

#### 1.3 認証システム実装
```typescript
// src/providers/FirebaseAuthProvider.tsx
- 認証状態管理Context
- Google OAuth実装
- ログイン/ログアウト機能
- 認証ガード機能
```

#### 1.4 共通ユーティリティ
```typescript
// src/utils/
- convertDate.ts: Timestamp変換
- errorMessage.ts: エラーメッセージ抽出
- array.ts: 配列操作
- date.ts: 日付処理
```

### フェーズ2: データ層実装（優先度: 高）

#### 2.1 Operations層実装
```
src/infrastructure/firestore/
├── ProfileOperations.ts
├── PublicMatchOperations.ts
├── PrivateMatchOperations.ts
├── MatchUpOperations.ts
└── UserOperations.ts
```

各Operationsファイルに実装する関数：
- `fetch*Operation`: データ取得
- `subscribe*Operation`: リアルタイム購読
- `create*Operation`: 作成
- `update*Operation`: 更新
- `delete*Operation`: 削除
- `isExists*Operation`: 存在確認

#### 2.2 カスタムフック実装
```
src/hooks/
├── usePublicMatches.ts       # 戦績取得（購読+ページネーション）
├── useMyProfile.ts           # 自分のプロフィール
├── useMyUser.ts              # 自分のユーザー情報
├── useUserProfile.ts         # 他ユーザープロフィール
├── useMyMatchUpResults.ts    # マッチアップ結果
├── useInfiniteScroll.ts      # 無限スクロール
├── useLocalStorage.ts        # ローカルストレージ
└── useToast.tsx              # トースト通知

src/features/match/hooks/
├── useCreatePublicMatchMutation.ts
├── useUpdatePublicMatchMutation.ts
└── useDeletePublicMatchMutation.ts

src/features/profile/hooks/
└── useUpdateProfileMutation.ts
```

### フェーズ3: UI/UX実装（優先度: 中）

#### 3.1 UIコンポーネント準備

**shadcn/ui コンポーネント追加**
```bash
# 必要なコンポーネントを追加
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
```

**カスタムコンポーネント実装**
```
src/components/
├── Base/
│   ├── Loading.tsx
│   ├── PageHead.tsx
│   └── GridTable.tsx
├── Displays/
│   ├── FighterIcon.tsx
│   ├── WinLoseResult.tsx
│   └── EmptyState.tsx
├── Inputs/
│   ├── FighterSelectorInput.tsx
│   ├── MultiFighterSelectorInput.tsx
│   └── ProfileImageInput.tsx
├── Layouts/
│   ├── DefaultLayout.tsx
│   ├── SimpleLayout.tsx
│   ├── NonAuthLayout.tsx
│   └── PublicLayout.tsx
└── Typography/
    └── DisplayItem.tsx
```

#### 3.2 ルーティング構成

```
src/routes/
├── __root.tsx                 # ルートレイアウト
├── index.tsx                  # / - 戦績一覧
├── login.tsx                  # /login - ログイン
├── register.tsx               # /register - 登録
├── mypage.tsx                 # /mypage - マイページ
├── edit.tsx                   # /edit - プロフィール編集
├── analytics.tsx              # /analytics - 分析
├── settings.tsx               # /settings - 設定
├── $username.tsx              # /$username - 公開プロフィール
└── _protected.tsx             # 認証必須ルート用レイアウト
```

### フェーズ4: 機能実装（優先度: 中）

#### 4.1 戦績管理機能
```
src/features/match/
├── components/
│   ├── EditMatchForm.tsx
│   ├── MatchListCard.tsx
│   ├── MatchListContainer.tsx
│   ├── ResultInput.tsx
│   └── StageSelector.tsx
├── hooks/
│   └── （前述）
└── types.ts
```

#### 4.2 プロフィール機能
```
src/features/profile/
├── components/
│   ├── EditProfileForm.tsx
│   ├── ProfileContainer.tsx
│   └── UserPageContainer.tsx
├── hooks/
│   └── （前述）
└── types.ts
```

#### 4.3 分析機能
```
src/features/analytics/
├── components/
│   ├── AnalyticsContainer.tsx
│   ├── TotalResultSummary.tsx
│   ├── MatchUpResultCard.tsx
│   └── AnalyticsSettingsModal.tsx
└── hooks/
    └── useAnalyticsSettings.ts
```

### フェーズ5: 最適化とテスト（優先度: 低）

#### 5.1 パフォーマンス最適化
- コード分割（lazy loading）
- Firebase SDKの動的インポート
- 画像最適化
- バンドルサイズ分析

#### 5.2 エラーハンドリング
- グローバルエラーバウンダリ
- Sentry統合
- エラートースト表示

#### 5.3 テスト
- 認証フローテスト
- CRUD操作テスト
- ルーティングテスト
- レスポンシブデザインテスト

## ディレクトリ構造（最終形）

```
apps/tanstack-start/
├── src/
│   ├── components/          # 共通UIコンポーネント
│   ├── features/            # 機能別モジュール
│   │   ├── match/
│   │   ├── profile/
│   │   ├── analytics/
│   │   ├── register/
│   │   ├── settings/
│   │   └── auth/
│   ├── hooks/              # グローバルカスタムフック
│   ├── infrastructure/     # Firestore/Storage操作
│   ├── lib/                # ライブラリ初期化
│   ├── providers/          # React Context Providers
│   ├── routes/             # ルート定義（ページ）
│   ├── styles/             # スタイルシート
│   ├── utils/              # ユーティリティ関数
│   ├── router.tsx          # ルーター設定
│   ├── routeTree.gen.ts    # 自動生成
│   └── styles.css          # グローバルスタイル
├── public/                 # 静的ファイル
├── .env.local              # 環境変数
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 実装順序（推奨）

1. **Firebase統合と基本設定**（現在作業中）
2. **認証システム実装**
3. **データ層（Operations）実装**
4. **基本的なカスタムフック実装**
5. **ログイン画面とプロフィール登録**
6. **戦績一覧画面**
7. **戦績登録・編集機能**
8. **マイページとプロフィール編集**
9. **戦績分析画面**
10. **設定画面と公開プロフィール**

## データフロー設計

```
UI Layer (React Components)
    ↓ イベント発火
Custom Hooks (TanStack Query)
    ↓ データ操作呼び出し
Operations Layer
    ↓ Firebase SDK呼び出し
Firestore / Storage
    ↓ データ返却
Operations Layer
    ↓ 型変換（convertDate）
Custom Hooks
    ↓ キャッシュ管理
UI Layer (再レンダリング)
```

## 移行時の注意事項

### 環境変数の変更
- `NEXT_PUBLIC_*` → `VITE_*` に変更
- `process.env.NEXT_PUBLIC_*` → `import.meta.env.VITE_*`

### ルーティングの変更
- Next.js Pages Router → TanStack Router
- 動的ルート: `[username].tsx` → `$username.tsx`
- APIルート: 別途Edge Functionsで実装

### UIライブラリの移行
- Mantine コンポーネント → shadcn/ui + カスタムコンポーネント
- CSS Modules → Tailwind CSS utilities

### データフェッチングの変更
- `useEffect` + `onSnapshot` → `useQuery` + `useInfiniteQuery`
- 手動キャッシュ管理 → TanStack Queryの自動キャッシュ

## リスク管理

| リスク | 影響度 | 対策 |
|--------|-------|------|
| UI移行の工数超過 | 高 | コンポーネント単位で段階的移行 |
| 型定義の不整合 | 中 | packages/commonを厳密に利用 |
| 認証フローの差異 | 高 | Next.js実装を参考に慎重に実装 |
| パフォーマンス劣化 | 中 | 初期から最適化を意識 |
| Firebase料金増加 | 低 | リアルタイム購読を最小限に |

## 成功指標（KPI）

### パフォーマンス指標
- [ ] 初期ロード時間: < 2秒
- [ ] ページ遷移時間: < 100ms
- [ ] バンドルサイズ: < 500KB（gzip後）
- [ ] Lighthouse スコア: > 90

### 機能指標
- [ ] 全ページの実装完了
- [ ] 全CRUD操作の動作確認
- [ ] リアルタイム更新の動作確認
- [ ] エラーハンドリング実装

### 品質指標
- [ ] TypeScript型エラー: 0
- [ ] ESLintエラー: 0
- [ ] コンソールエラー: 0
- [ ] アクセシビリティ対応

## タイムライン

| 週 | フェーズ | 成果物 |
|----|---------|--------|
| 1-2 | 基盤構築 | Firebase統合、認証システム |
| 3-4 | データ層 | Operations、カスタムフック |
| 5-6 | 基本UI | ログイン、戦績一覧 |
| 7 | 戦績管理 | CRUD操作、リアルタイム更新 |
| 8 | プロフィール | 作成、編集、表示 |
| 9 | 分析・設定 | 分析画面、設定画面 |
| 10 | 最適化 | パフォーマンス改善、テスト |

## 完了条件

- ✅ 全機能がSPAモードで正常動作
- ✅ 認証フローが安定稼働
- ✅ データの整合性が保たれている
- ✅ UIがレスポンシブ対応
- ✅ エラーが適切にハンドリング
- ✅ ドキュメントが整備されている

---

*最終更新: 2026-03-22*
*作成者: Claude (AI Assistant)*
*プロジェクト: スマレポ - TanStack Start移行*