# React Native版 実装方針

## 1. 技術スタック選定

### 1.1 必須ライブラリ
- **React Native**: 0.81.5（Expo SDK 54に含まれる）
- **Expo**: ~54.0.25
- **TypeScript**: ~5.9.2
- **Firebase**: Web版と同じバージョン（`firebase`パッケージ）

### 1.2 選定が必要なライブラリ

#### ナビゲーション
- **採用**: `expo-router`（Expoのファイルベースルーティングシステム）
  - 理由: Next.jsライクなファイルベースルーティング、型安全、Expoとの統合が良い
  - バージョン: ~4.0.0

#### UIコンポーネントライブラリ
- **採用**: `tamagui`（スタイリング優先）
  - 理由: パフォーマンスが良い、Web版とのコード共有が可能、柔軟なスタイリング
  - バージョン: ^1.115.0
  - 関連パッケージ: `@tamagui/core`, `@tamagui/config`, `@tamagui/babel-plugin`

#### フォーム管理
- **採用**: `react-hook-form` + `@hookform/resolvers` + `zod`
  - 理由: Web版と同じライブラリを使用することで、バリデーションロジックを共通化可能
  - バージョン: `react-hook-form@7.55.0`, `@hookform/resolvers@^4.1.3`, `zod@^3.24.2`

#### 状態管理
- **採用**: React Context API（Web版と同じ）
  - 理由: シンプルで十分、追加のライブラリ不要
  - 将来的に必要になったら: `zustand`や`jotai`を検討

#### 画像処理
- **採用**: `expo-image`（Expoに含まれる）
  - 理由: パフォーマンスが良い、キャッシュ機能あり
  - バージョン: ~3.0.10
  - 画像選択: `expo-image-picker`（バージョン: ~16.0.0）
  - 画像編集: `expo-image-manipulator`（バージョン: ~13.0.0）

#### トースト通知
- **採用**: `react-native-paper`の`Snackbar`コンポーネント
  - 理由: シンプルで使いやすい、Tamaguiと併用可能
  - バージョン: ^5.12.3

#### 日付処理
- **採用**: `dayjs`（Web版と同じ）
  - 理由: 軽量、Web版との一貫性
  - バージョン: ^1.11.13

#### その他の必須ライブラリ
- **Firebase**: `firebase@^11.5.0`（Web版と同じ）
- **AsyncStorage**: `@react-native-async-storage/async-storage@~2.1.0`（Firebase認証の永続化用）
- **Safe Area**: `react-native-safe-area-context@~4.12.0`（expo-routerの依存関係）
- **Screens**: `react-native-screens@~4.4.0`（expo-routerの依存関係）

---

## 2. プロジェクト構成

### 2.1 ディレクトリ構造

```
apps/native/
├── src/
│   ├── components/          # 共通コンポーネント
│   │   ├── Base/           # 基本コンポーネント（Button, Loading, etc.）
│   │   ├── Typography/    # テキストコンポーネント
│   │   ├── Inputs/        # 入力コンポーネント
│   │   └── Layouts/       # レイアウトコンポーネント
│   ├── features/           # 機能別コンポーネント（Web版と同じ構造）
│   │   ├── auth/          # 認証関連
│   │   ├── profile/       # プロフィール機能
│   │   ├── match/         # 戦績機能
│   │   ├── analytics/     # 分析機能
│   │   ├── register/      # 登録機能
│   │   └── settings/      # 設定機能
│   ├── navigation/        # ナビゲーション設定
│   ├── providers/         # Context Provider
│   ├── hooks/             # カスタムフック（Web版と共通化可能なもの）
│   ├── infrastructure/    # インフラ層（Firestore操作など）
│   ├── lib/               # ライブラリ設定（Firebase初期化など）
│   ├── utils/             # ユーティリティ関数
│   └── types/             # 型定義（共通でないもの）
├── assets/                # 画像、フォントなどのリソース
│   ├── images/
│   └── fighters/          # ファイターアイコン（Web版からコピー）
└── App.tsx                # エントリーポイント
```

### 2.2 Web版との共通化方針

#### 共通化するもの
- **型定義**: `packages/common`を使用（既存）
- **バリデーションスキーマ**: `zod`スキーマを`packages/common`に移動して共有
- **Firestore操作ロジック**: `infrastructure/firestore`のロジックを可能な限り共通化
- **ユーティリティ関数**: プラットフォーム非依存の関数は共通化

#### プラットフォーム固有のもの
- **UIコンポーネント**: Web版（Mantine）とNative版（react-native-paper）で別実装
- **ナビゲーション**: Web版（Next.js Router）とNative版（React Navigation）で別実装
- **スタイリング**: Web版（CSS Modules）とNative版（StyleSheet）で別実装

---

## 3. 実装フェーズ

### フェーズ1: 基盤構築 ✅ 完了
1. **ライブラリのインストール** ✅
   - 必要なライブラリをインストール完了

2. **Firebase設定** ✅
   - `src/lib/firebase.ts`を作成（Web版を参考に）
   - AsyncStorageを使用した認証状態の永続化
   - 環境変数の設定が必要（`.env`ファイル）

3. **ナビゲーション設定** ✅
   - expo-routerのセットアップ完了
   - ファイルベースルーティングの構造作成
   - 認証フロー（`(auth)`）とメインフロー（`(tabs)`）の分離

4. **UIライブラリ設定** ✅
   - Tamaguiの設定完了
   - `tamagui.config.ts`の作成
   - `TamaguiProvider`の設定

5. **プロバイダー設定**（次フェーズ）
   - `FirebaseAuthProvider`の実装（Web版を参考に）
   - `LoadingProvider`の実装
   - `ToastProvider`の実装

6. **共通コンポーネント**（次フェーズ）
   - 基本的なButton、Text、Inputコンポーネント
   - Loadingコンポーネント
   - Layoutコンポーネント

### フェーズ2: 認証・プロフィール機能
1. **認証画面**
   - ログイン画面（Google認証）
   - 認証状態の管理

2. **プロフィール作成画面**
   - フォーム実装（react-hook-form使用）
   - バリデーション（zod使用）
   - 画像アップロード機能

3. **プロフィール編集画面**
   - 既存プロフィールの編集
   - 画像編集機能

4. **マイページ**
   - プロフィール表示
   - 戦績サマリー表示

### フェーズ3: 戦績機能
1. **戦績一覧画面**
   - 戦績リストの表示
   - 無限スクロールまたはページネーション
   - 戦績カードコンポーネント

2. **戦績登録画面**
   - フォーム実装
   - ファイター選択UI
   - ステージ選択UI
   - 勝敗入力UI

3. **戦績編集・削除**
   - 編集モーダル
   - 削除確認ダイアログ

### フェーズ4: 分析機能
1. **分析画面**
   - マッチアップ結果の表示
   - ファイター別フィルタリング
   - グラフ表示（必要に応じて）

### フェーズ5: その他機能
1. **設定画面**
   - ログアウト機能
   - その他の設定項目

2. **ランディングページ**
   - 新規ユーザー向けの説明画面

3. **公開プロフィールページ**
   - 他のユーザーのプロフィール表示（オプション）

---

## 4. 技術的な考慮事項

### 4.1 Firebase認証
- **Web版**: `signInWithPopup`を使用
- **Native版**: `signInWithCredential` + `GoogleSignIn`（Expoの`expo-auth-session`または`@react-native-google-signin/google-signin`）
- **注意**: Expo GoではGoogle認証が制限される可能性があるため、開発ビルドが必要

### 4.2 画像アップロード
- **Web版**: `firebase/storage`を使用
- **Native版**: 同じく`firebase/storage`を使用
- **画像選択**: `expo-image-picker`を使用
- **画像編集**: `expo-image-manipulator`を使用

### 4.3 オフライン対応
- Firestoreのオフライン永続化を有効化
- ネットワーク状態の監視
- オフライン時のエラーハンドリング

### 4.4 パフォーマンス
- 画像の最適化（`expo-image`の使用）
- リストの仮想化（`FlatList`の適切な使用）
- 不要な再レンダリングの防止（`React.memo`、`useMemo`、`useCallback`の活用）

### 4.5 エラーハンドリング
- グローバルエラーハンドリング
- ネットワークエラーの適切な表示
- ユーザーフレンドリーなエラーメッセージ

---

## 5. UI/UX設計方針

### 5.1 デザイン原則
- **Web版との一貫性**: 機能と情報構造はWeb版と同じ
- **ネイティブらしさ**: iOS/Androidのプラットフォームガイドラインに準拠
- **タッチ操作**: タップ領域を十分に確保（最低44x44pt）

### 5.2 カラースキーム
- Web版のカラーパレットを参考に
- ダークモード対応（将来的に）

### 5.3 ナビゲーション
- **タブナビゲーション**: 主要画面（ホーム、分析、マイページ）
- **スタックナビゲーション**: 詳細画面、編集画面
- **モーダル**: 戦績登録、設定など

---

## 6. 開発環境・ツール

### 6.1 開発ツール
- **Expo Dev Tools**: 開発サーバー
- **React Native Debugger**: デバッグ
- **Flipper**: ネットワーク、状態の監視

### 6.2 テスト
- **単体テスト**: Jest + React Native Testing Library
- **E2Eテスト**: Detox（将来的に）

### 6.3 リント・フォーマット
- **ESLint**: Web版と同じ設定を可能な限り共有
- **Prettier**: Web版と同じ設定
- **TypeScript**: 厳格な型チェック

---

## 7. 実装時の注意点

### 7.1 Web版との差分
- **認証方法**: Web版は`signInWithPopup`、Native版は`signInWithCredential`
- **画像処理**: Web版は`sharp`、Native版は`expo-image-manipulator`
- **OGP生成**: Native版では不要（Web版のみ）
- **公開プロフィールページ**: Native版では実装しない可能性（Web版のみ）

### 7.2 プラットフォーム固有の実装
- **iOS**: Safe Areaの考慮、ハプティックフィードバック
- **Android**: バックボタンの処理、Material Designの適用

### 7.3 パフォーマンス最適化
- 画像の遅延読み込み
- リストの仮想化
- メモ化の適切な使用

---

## 8. 次のステップ

1. **ライブラリの選定とインストール**
   - ナビゲーションライブラリの選定
   - UIコンポーネントライブラリの選定
   - その他必要なライブラリのインストール

2. **Firebase設定**
   - `src/lib/firebase.ts`の作成
   - 環境変数の設定

3. **ナビゲーション構造の設計**
   - 画面遷移図の作成
   - ナビゲーションタイプの決定

4. **共通コンポーネントの実装**
   - 基本的なコンポーネントから実装開始

5. **認証機能の実装**
   - 認証フローの実装
   - 認証状態の管理

---

## 9. 参考リソース

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Firebase React Native Documentation](https://rnfirebase.io/)
- Web版の実装コード（`apps/web/src/`）

