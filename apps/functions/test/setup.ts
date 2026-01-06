/**
 * Vitestのテスト環境セットアップファイル
 * テスト実行前に環境変数をグローバルに設定する
 */
process.env.SLACK_NOTIFICATION_EMAIL_ADDRESS = 'test@example.com'
process.env.PROJECT_ID = 'smarepo-functions-test'
process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
