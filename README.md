# スマレポ

スマブラ戦績管理ツール

## このアプリは？

- スマブラのオンライン対戦の戦績を記録することができます
- 記録した戦績から自分の得意不得意を分析することができます
- プロフィールをシェアすることでオンライン対戦の戦績を公開することができます

## 技術スタック

- フロントエンド: Next.js, TypeScript
- コンポーネントライブラリ: Mantine
- スタイリング: CSS Modules
- バックエンド: Cloud Functions for Firebase, TypeScript, Express
- データベース: Firestore
- 認証: Firebase Authentication
- バッチ処理: Cloud Scheduler
- インフラ: Vercel, Firebase
- 開発ツール: pnpm, turborepo
- 配信形式: Webアプリ, PWA

## DB設計

- [firestore-design.md](firestore-design.md)を参照

## 主要機能

- ログイン・新規登録
- プロフィール作成（名前、アイコン、メインキャラの登録）
- 戦績登録（使用ファイター、対戦相手のファイター、勝敗、世界戦闘力を記録）
- 戦績分析（登録された戦績データを使用）
- マイページ（プロフィールと戦績の表示）
