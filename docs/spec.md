# スマレポ アプリケーション仕様書

## 目次

1. [概要](#1-概要)
2. [アーキテクチャ](#2-アーキテクチャ)
3. [認証・ユーザー管理](#3-認証ユーザー管理)
4. [プロフィール機能](#4-プロフィール機能)
5. [戦績登録機能](#5-戦績登録機能)
6. [戦績一覧・表示機能](#6-戦績一覧表示機能)
7. [戦績分析機能](#7-戦績分析機能)
8. [プロフィール公開・シェア機能](#8-プロフィール公開シェア機能)
9. [設定機能](#9-設定機能)
10. [データモデル](#10-データモデル)
11. [API仕様](#11-api仕様)
12. [UI/UX仕様](#12-uiux仕様)
13. [エラーハンドリング](#13-エラーハンドリング)
14. [パフォーマンス要件](#14-パフォーマンス要件)
15. [セキュリティ要件](#15-セキュリティ要件)

---

## 1. 概要

### 1.1 アプリケーションの目的
スマブラ（大乱闘スマッシュブラザーズ）のオンライン対戦の戦績を記録・分析するためのアプリケーション。

### 1.2 主要な機能
- ユーザー認証・登録
- プロフィール作成・編集
- 戦績の登録・編集・削除
- 戦績の一覧表示
- マッチアップ分析（ファイター別の勝率分析）
- プロフィールの公開・シェア

### 1.3 対象プラットフォーム
- Web版（Next.js、PWA対応）
- ネイティブ版（React Native、iOS/Android）

---

## 2. アーキテクチャ

### 2.1 技術スタック（Web版）
- フロントエンド: Next.js, TypeScript
- コンポーネントライブラリ: Mantine
- スタイリング: CSS Modules
- バックエンド: Cloud Functions for Firebase, TypeScript, Express
- データベース: Firestore
- 認証: Firebase Authentication
- インフラ: Vercel, Firebase

### 2.2 技術スタック（ネイティブ版予定）
- フレームワーク: React Native, Expo
- 言語: TypeScript
- 状態管理: （要検討）
- ナビゲーション: （要検討）
- 認証: Firebase Authentication
- データベース: Firestore

### 2.3 プロジェクト構成
- `apps/web/`: Web版のアプリケーション（Next.js）
- `apps/native/`: Native版のアプリケーション（React Native）
- `apps/functions/`: Firebase Functions（バックエンドAPI）
- `packages/common/`: 共通の型定義・エンティティ

---

## 3. 認証・ユーザー管理

### 3.1 認証方式
- Firebase Authenticationを使用
- 認証プロバイダー: Google（現時点）

### 3.2 認証フロー
1. ユーザーがGoogleアカウントでログイン
2. Firebase Authenticationでユーザー作成
3. `users`コレクションにユーザー情報を保存（初回のみ）
4. プロフィール未作成の場合はプロフィール作成画面へリダイレクト
5. プロフィール作成済みの場合はトップ画面へリダイレクト

### 3.3 認証が必要なページ
- `/`（トップ・戦績一覧）
- `/i/analytics`（分析画面）
- `/i/edit`（戦績編集画面）
- `/i/mypage`（マイページ）
- `/i/register`（プロフィール作成画面）
- `/i/settings`（設定画面）

### 3.4 認証が不要なページ
- `/i/new`（新規ユーザー向けランディングページ）
- `/[username]`（公開プロフィールページ）

### 3.5 ログアウト機能
- 設定画面からログアウト可能
- ログアウト後は`/i/new`へリダイレクト

---

## 4. プロフィール機能

### 4.1 プロフィール作成（初回登録）
#### 4.1.1 必須項目
- 表示名（displayName）
  - 1文字以上30文字以内
- ユーザー名（username）
  - 5文字以上15文字以内
  - 英数字とアンダースコア（_）のみ
  - 重複チェックあり（API経由）
- X ID（xId）
  - 1文字以上15文字以内
- プロフィール画像（profileImageUrl）
  - 必須（1文字以上）
- メインファイター（mainFighterIds）
  - 配列形式、最低1つ選択必須

#### 4.1.2 作成フロー
1. 認証済みユーザーが`/i/register`にアクセス
2. フォームに入力
3. ユーザー名の重複チェック（API呼び出し）
4. バリデーション通過後、プロフィール作成
5. 作成成功後、トップ画面へリダイレクト

### 4.2 プロフィール編集
#### 4.2.1 編集可能項目
- 表示名（displayName）
- ユーザー名（username）
  - 変更時は重複チェックあり
- X ID（xId）
- フレンドコード（friendCode）
  - 任意項目
  - フォーマット: `SW-1234-1234-1234`（17文字）
- プロフィール画像（profileImageUrl）
- メインファイター（mainFighterIds）
  - 複数選択可能
- 主なプレイ時間（mainPlayingTime）
- 自己紹介（selfIntroduction）
  - 任意項目、最大1000文字
- スマメイト最高レート（smashMateMaxRating）
  - 任意項目、0〜5000の範囲
- ボイスチャット設定（voiceChat）
  - discord: boolean
  - line: boolean
  - nintendoOnline: boolean
  - listenOnly: boolean
- プロフィール公開設定（isPrivateProfile）
  - true: 非公開、false: 公開

#### 4.2.2 編集画面
- パス: `/i/edit`
- マイページから遷移可能

### 4.3 プロフィール表示
#### 4.3.1 マイページ
- パス: `/i/mypage`
- 自分のプロフィール情報を表示
- 戦績サマリーを表示
- プロフィール編集へのリンク

#### 4.3.2 公開プロフィールページ
- パス: `/[username]`
- 公開設定がfalseの場合のみ表示可能
- プロフィール情報と戦績を表示
- OGP対応（メタタグ設定）

---

## 5. 戦績登録機能

### 5.1 戦績データの項目
- 自分のファイター（myFighterId, myFighterName）
  - 必須
- 相手のファイター（opponentFighterId, opponentFighterName）
  - 必須
- 勝敗（result）
  - 必須
  - 値: `'WIN'` | `'LOSE'` | `'DRAW'`
- ステージ（stage）
  - 任意
  - 値: `'BATTLEFIELD'` | `'SMALL_BATTLEFIELD'` | `'FINAL_DESTINATION'` | null
- 世界戦闘力（globalSmashPower）
  - 任意
  - 範囲: 1〜3000（万単位）
- VIPマッチかどうか（isElite）
  - boolean
- 連戦かどうか（isContinuedMatch）
  - boolean

### 5.2 戦績登録フロー
1. トップ画面の「戦績を追加」ボタンから登録フォームを開く
2. 各項目を入力
3. バリデーション通過後、`publicMatches`コレクションに保存
4. 保存後、Firebase Functionsのトリガーが発火
5. マッチアップ結果（matchUpResults）が自動更新される

### 5.3 戦績編集
- 既存の戦績を編集可能
- 編集時はマッチアップ結果も自動的に再計算される

### 5.4 戦績削除
- 戦績を削除可能
- 削除時はマッチアップ結果も自動的に更新される

---

## 6. 戦績一覧・表示機能

### 6.1 戦績一覧画面
- パス: `/`（トップ画面）
- 認証済みユーザーの戦績を時系列で表示
- 各戦績カードに以下を表示:
  - 自分のファイターアイコン
  - 相手のファイターアイコン
  - 勝敗結果
  - ステージ（入力されている場合）
  - 世界戦闘力（入力されている場合）
  - VIPマッチかどうか
  - 連戦かどうか
  - 作成日時

### 6.2 戦績サマリー
- 総対戦数
- 勝率
- 最近の戦績傾向

### 6.3 戦績のフィルタリング・ソート
- （要確認: 実装されているか）

---

## 7. 戦績分析機能

### 7.1 マッチアップ分析画面
- パス: `/i/analytics`
- ファイター別のマッチアップ戦績を表示

### 7.2 表示内容
- 自分のファイター vs 相手のファイターの組み合わせごとに表示
- 各マッチアップ結果に以下を表示:
  - 自分のファイターアイコン
  - 相手のファイターアイコン
  - 勝数（wins）
  - 負数（loses）
  - 勝率（wins / matches * 100）
  - 総対戦数（matches）

### 7.3 ソート順
1. 総対戦数の多い順
2. 勝率の高い順
3. 相手ファイターIDの辞書順

### 7.4 フィルタリング
- 自分のファイターでフィルタリング可能
- 最近使用したファイター8件をクイック選択として表示

### 7.5 データの自動更新
- 戦績が登録・編集・削除されると、Firebase Functionsのトリガーで自動的にマッチアップ結果が更新される
- `users/{userId}/matchUpResults`コレクションに保存

---

## 8. プロフィール公開・シェア機能

### 8.1 公開設定
- プロフィール編集画面で公開/非公開を設定可能
- `isPrivateProfile: true`の場合、公開プロフィールページは表示されない

### 8.2 公開プロフィールページ
- URL: `/{username}`
- 公開設定がfalseの場合のみアクセス可能
- プロフィール情報を表示
- 戦績情報を表示（要確認: どの程度の情報を表示するか）

### 8.3 OGP（Open Graph Protocol）対応
- プロフィールページにOGPメタタグを設定
- OGP画像は動的に生成される（`ogpImageUrl`）
- OGP画像生成API: `/api/ogp/generate`

### 8.4 シェア機能
- （要確認: 実装されているか、どのような形式か）

---

## 9. 設定機能

### 9.1 設定画面
- パス: `/i/settings`
- ログアウト機能
- （要確認: その他の設定項目）

---

## 10. データモデル

### 10.1 Firestoreコレクション構成

#### 10.1.1 users
- ID: Firebase AuthのUID
- フィールド:
  - `createdAt`: Timestamp
  - `email`: String
  - `updatedAt`: Timestamp

#### 10.1.2 profiles
- ID: userId（usersのUIDと同じ）
- フィールド:
  - `createdAt`: Timestamp
  - `displayName`: String（1-30文字）
  - `friendCode`: String（任意、`SW-1234-1234-1234`形式）
  - `isPrivateProfile`: Boolean
  - `mainFighter`: String（メインファイターID）
  - `mainPlayingTime`: String
  - `ogpImageUrl`: String（OGP画像URL）
  - `profileImageUrl`: String
  - `selfIntroduction`: String（任意、最大1000文字）
  - `smashMateMaxRating`: Number（任意、0-5000）
  - `updatedAt`: Timestamp
  - `username`: String（5-15文字、英数字とアンダースコアのみ、ユニーク）
  - `voiceChat`: Map
    - `discord`: Boolean
    - `line`: Boolean
    - `nintendoOnline`: Boolean
    - `listenOnly`: Boolean
  - `xId`: String（1-15文字）

#### 10.1.3 publicMatches
- ID: 自動生成
- フィールド:
  - `createdAt`: Timestamp
  - `isContinuedMatch`: Boolean
  - `isElite`: Boolean
  - `globalSmashPower`: Number（任意、1-3000）
  - `myFighterId`: String
  - `myFighterName`: String
  - `opponentFighterId`: String
  - `opponentFighterName`: String
  - `result`: String（'WIN' | 'LOSE' | 'DRAW'）
  - `stage`: String（'BATTLEFIELD' | 'SMALL_BATTLEFIELD' | 'FINAL_DESTINATION' | null）
  - `updatedAt`: Timestamp
  - `userId`: String

#### 10.1.4 users/{userId}/matchUpResults
- ID: 自動生成
- フィールド:
  - `createdAt`: Timestamp
  - `loses`: Number
  - `matches`: Number
  - `myFighterId`: String
  - `myFighterName`: String
  - `opponentFighterId`: String
  - `opponentFighterName`: String
  - `updatedAt`: Timestamp
  - `wins`: Number

### 10.2 データの関係性
- `users`と`profiles`は1対1の関係（userIdで紐づく）
- `publicMatches`は`users`に属する（userIdで紐づく）
- `matchUpResults`は`users/{userId}`のサブコレクション
- `matchUpResults`は`publicMatches`の変更に応じて自動更新される（Firebase Functionsのトリガー）

---

## 11. API仕様

### 11.1 バックエンドAPI（Firebase Functions）
- エンドポイント: `process.env.NEXT_PUBLIC_API_ENDPOINT`
- 認証: Bearer Token（Firebase Auth Token）

#### 11.1.1 ユーザー名重複チェック
- エンドポイント: `POST /user/username`
- リクエストボディ:
  ```json
  {
    "username": "string"
  }
  ```
- レスポンス:
  ```json
  {
    "isValid": boolean
  }
  ```

### 11.2 フロントエンドAPI（Next.js API Routes）
#### 11.2.1 OGP画像生成
- エンドポイント: `GET /api/ogp/generate`
- クエリパラメータ: （要確認）

---

## 12. UI/UX仕様

### 12.1 レイアウト
- デフォルトレイアウト: ヘッダー、フッター（ナビゲーション）付き
- 公開レイアウト: ヘッダー、フッターなし（公開プロフィールページ用）
- 非認証レイアウト: ヘッダー、フッターなし（ランディングページ用）

### 12.2 ナビゲーション
- フッターナビゲーション:
  - ホーム（戦績一覧）
  - 分析
  - マイページ
  - （要確認: その他の項目）

### 12.3 コンポーネント
- ファイターアイコン表示
- 勝敗結果表示
- ローディング表示
- エラー表示
- トースト通知

### 12.4 レスポンシブデザイン
- （要確認: モバイル・タブレット・デスクトップ対応状況）

---

## 13. エラーハンドリング

### 13.1 エラー表示
- トースト通知でエラーメッセージを表示
- エラーメッセージには詳細情報を含める（関数名、引数、パラメータなど）

### 13.2 エラーケース
- 認証エラー
- バリデーションエラー
- ネットワークエラー
- Firestoreエラー
- APIエラー

---

## 14. パフォーマンス要件

### 14.1 読み込み速度
- （要確認: 具体的な要件）

### 14.2 データ取得
- 必要最小限のデータのみ取得
- ページネーション（要確認: 実装されているか）

---

## 15. セキュリティ要件

### 15.1 認証・認可
- Firebase Authenticationによる認証
- Firestore Security Rulesによるデータアクセス制御

### 15.2 データ保護
- 個人情報は`users`コレクションに保存
- 公開情報のみ`profiles`コレクションに保存

### 15.3 バリデーション
- クライアント側バリデーション
- サーバー側バリデーション（Firestore Rules、API）

---
