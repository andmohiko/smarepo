# firestore 設計

- [profiles](#profiles)
- [publicMatches](#publicMatches)
- [users](#users)
  - [matchUpResults](#matchUpResults)

## profiles

### 概要

- ユーザーのプロフィール一覧
- usersコレクションは個人情報を含むため、公開してよい情報だけをprofilesコレクションに保存する
- ID: userId

### 詳細

- createdAt: Timestamp 作成日時
- displayName: String 表示名（ユーザー名）
- friendCode: String Switchのフレンドコード
- isPrivateProfile: Boolean プロフィールを非公開にするかどうか
- mainFighter: String メインファイターのID
- mainPlayingTime: String 主なプレイ時間
- profileImageUrl: String プロフィール画像のURL
- selfIntroduction: String 自己紹介
- smashMateMaxRating: Number スマメイト最高レート
- updatedAt: Timestamp 更新日時
- username: String ユーザーID
- voiceChat: Map ボイスチャット
  - discord: Boolean
  - line: Boolean
  - nintendoOnline: Boolean
  - listenOnly: Boolean
- xId: String XのID

## publicMatches

### 概要

- オンライン対戦「だれかと」との戦績一覧
- ID: 自動生成

### 詳細

- createdAt: Timestamp 作成日時
- isContinuedMatch: Boolean 連戦かどうか
- isElite: Boolean VIPマッチかどうか
- globalSmashPower: Number 世界戦闘力（万）
- myFighterId: String 自分のファイターID
- myFighterName: String 自分のファイター名
- opponentFighterId: 相手のファイターID
- opponentFighterName: 相手のファイター名
- result: String ('WIN' | 'LOSE' | 'DRAW') 勝敗
- stage: String ('BATTLEFIELD' | 'SMALL_BATTLEFIELD' | 'FINAL_DESTINATION') ステージ
- updatedAt: Timestamp 更新日時
- userId: String ユーザーID

## users

### 概要

- ユーザー一覧
- 個人情報を含む
- ID: Firebase AuthのUid

### 詳細

- createdAt: Timestamp 作成日時
- email: String メールアドレス
- updatedAt: Timestamp 更新日時

## matchUpResults

### 概要

- ユーザーのマッチアップ戦績一覧
- ID: 自動生成

### 詳細

- createdAt: Timestamp 作成日時
- loses: Number 負けた数
- matches: Number 対戦数
- myFighterId: String 自分のファイターID
- myFighterName: String 自分のファイター名
- opponentFighterId: 相手のファイターID
- opponentFighterName: 相手のファイター名
- updatedAt: Timestamp 更新日時
- wins: Number 勝った数
