/**
 * エラーオブジェクトからエラーメッセージを抽出するユーティリティ関数
 * @param e - エラーオブジェクト（unknown型）
 * @returns エラーメッセージ文字列
 */
export function errorMessage(e: unknown): string {
  // Errorインスタンスの場合
  if (e instanceof Error) {
    return e.message
  }

  // 文字列の場合
  if (typeof e === 'string') {
    return e
  }

  // messageプロパティを持つオブジェクトの場合
  if (typeof e === 'object' && e !== null && 'message' in e) {
    return String((e as { message: unknown }).message)
  }

  // その他の場合
  return '予期しないエラーが発生しました'
}

/**
 * Firebaseエラーコードから日本語メッセージを返すユーティリティ関数
 * @param code - Firebaseエラーコード
 * @returns 日本語のエラーメッセージ
 */
export function getFirebaseErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    // 認証関連
    'auth/user-not-found': 'ユーザーが見つかりません',
    'auth/wrong-password': 'パスワードが間違っています',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/weak-password': 'パスワードが弱すぎます',
    'auth/popup-closed-by-user': 'ログインがキャンセルされました',
    'auth/cancelled-popup-request': 'ログインがキャンセルされました',
    'auth/requires-recent-login': '再度ログインが必要です',
    'auth/invalid-credential': '認証情報が無効です',

    // Firestore関連
    'permission-denied': 'データへのアクセス権限がありません',
    'unavailable': 'サービスが一時的に利用できません',
    'deadline-exceeded': 'リクエストがタイムアウトしました',
    'not-found': 'データが見つかりません',
    'already-exists': 'データが既に存在します',
    'resource-exhausted': 'クォータを超過しました',

    // Storage関連
    'storage/object-not-found': 'ファイルが見つかりません',
    'storage/unauthorized': 'ファイルへのアクセス権限がありません',
    'storage/canceled': 'アップロードがキャンセルされました',
    'storage/invalid-checksum': 'ファイルが破損している可能性があります',
    'storage/retry-limit-exceeded': 'アップロードの再試行回数が上限に達しました',
  }

  return errorMessages[code] ?? 'エラーが発生しました'
}

/**
 * Firebaseエラーからユーザー向けメッセージを生成するユーティリティ関数
 * @param error - エラーオブジェクト
 * @returns ユーザー向けのエラーメッセージ
 */
export function formatFirebaseError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code
    return getFirebaseErrorMessage(code)
  }

  return errorMessage(error)
}