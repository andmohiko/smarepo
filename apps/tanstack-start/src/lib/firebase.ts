import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  serverTimestamp as getServerTimeStamp,
} from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

/**
 * Firebase設定オブジェクト
 * 環境変数から読み込み（Viteのimport.meta.envを使用）
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Firebase アプリケーションの初期化
const firebaseApp = initializeApp(firebaseConfig)

// Firebase Authentication
const auth = getAuth(firebaseApp)
auth.languageCode = 'ja' // 日本語設定

// Cloud Firestore
const db = getFirestore(firebaseApp)

// サーバータイムスタンプ用の関数
const serverTimestamp = getServerTimeStamp()

// Cloud Storage
const storage = getStorage(firebaseApp)

// エミュレーター接続（開発環境のみ）
if (import.meta.env.VITE_USE_EMULATOR === 'true' && import.meta.env.DEV) {
  // Firestore Emulator
  connectFirestoreEmulator(db, 'localhost', 8080)

  // Storage Emulator
  connectStorageEmulator(storage, 'localhost', 9199)

  console.log('🔧 Firebase Emulators connected')
}

export { auth, db, serverTimestamp, storage }