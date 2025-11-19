/**
 * Firebase Functionsのグローバル設定
 * @description すべてのFirebase Functionsに適用される設定を定義
 */
import { setGlobalOptions } from 'firebase-functions/v2'

// グローバルオプションの設定
setGlobalOptions({
  region: 'asia-northeast1',
  memory: '1GiB',
})
