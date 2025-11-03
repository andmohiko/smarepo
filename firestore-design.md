# firestore 設計

- [matches](#matches)
- [profiles](#profiles)
- [records](#records)
- [users](#users)

## profiles

### 概要

- ユーザーのプロフィール一覧
- usersコレクションは個人情報を含むため、公開してよい情報だけをprofilesコレクションに保存する
- ID: userId

### 詳細

- createdAt: Timestamp 作成時刻
- displayName: String 表示名（ユーザー名）
- friendCode: String Switchのフレンドコード
- isPrivateProfile: Boolean プロフィールを非公開にするかどうか
- mainFighter: String メインファイターのID
- profileImageUrl: String プロフィール画像のURL
- selfIntroduction
- updatedAt: Timestamp 更新時刻
- username: String ユーザーID
- voiceChat: Map ボイスチャット
  - discord: Boolean
  - line: Boolean
  - nintendoOnline: Boolean
  - listenOnly: Boolean
- xId: String XのID

## users

### 概要

- ユーザ
- ID: Firebase AuthのUid

### 詳細

- createdAt: Timestamp 作成した時間
- updatedAt: Timestamp 更新した時間
- userId: String ←使わない
- authId: String ←document Id
- userOriginalId: String マイページのURL
- username: String
- twitterId: String
- main: String fighterId
- sub: String fighterId
- winningPercentage: Object
  - matches: Number
  - wins: Number
  - loses: Number
- friendCode: String
- selfIntroduction: String
- smashmateRating: Number
- mainPlayingTime: String
- voiceChat: map
  - discord: Boolean
  - line: Boolean
  - nintendoOnline: Boolean
  - skype: Boolean
  - listenOnly: Boolean
  - ng: Boolean
  <!-- - playStyle: map
  - tournament/oneOnOne
  - items: String on/off -->
  <!-- - privateSettings: Map
  - isPrivate: Boolean
  - showProfile: Boolean
  - showLatestGlobalSmashPower: Boolean
  - showWinningRate: Boolean
  - showAnalytics: Boolean -->

## records

### 概要

- 戦績
- ID: 自動id

### 詳細

- createdAt: Timestamp 作成した時間
- updatedAt: Timestamp 更新した時間
- userId: String authId
- fighter: String 自分のファイター
- fighterId: String 自分のファイターID
- opponent: String 自分のファイター
- opponentId: String 自分のファイターID
- result: Boolean 勝ち/負け
- stage: String ステージ
- globalSmashPower: Number 世界戦闘力
- isRepeat: Boolean 連戦かどうか
- isVip: Boolean VIPかどうか
<!-- - stocksTaken: map
  - own: number 自分のストックを落とされた数
  - opponent: number 相手のストックを落とした数 -->
- roomType: String online|arena
- against: String 相手の名前
