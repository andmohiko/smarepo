import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/**
 * トーストメッセージの型定義
 */
export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

/**
 * トーストコンテキストの型定義
 */
interface ToastContextType {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  showSuccessToast: (title: string, description?: string) => void
  showErrorToast: (title: string, description?: string) => void
  showWarningToast: (title: string, description?: string) => void
  removeToast: (id: string) => void
}

// コンテキストの作成
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * トーストプロバイダーコンポーネント
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * トーストを表示する
   */
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      variant: 'default',
      ...toast,
    }

    setToasts((prev) => [...prev, newToast])

    // 自動的に削除
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  /**
   * 成功トーストを表示する
   */
  const showSuccessToast = useCallback(
    (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'success',
      })
    },
    [showToast]
  )

  /**
   * エラートーストを表示する
   */
  const showErrorToast = useCallback(
    (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'error',
        duration: 10000, // エラーは長めに表示
      })
    },
    [showToast]
  )

  /**
   * 警告トーストを表示する
   */
  const showWarningToast = useCallback(
    (title: string, description?: string) => {
      showToast({
        title,
        description,
        variant: 'warning',
      })
    },
    [showToast]
  )

  /**
   * トーストを削除する
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value: ToastContextType = {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* トースト表示コンポーネント（後で実装） */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * トーストコンテキストを使用するカスタムフック
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * トーストコンテナコンポーネント（仮実装）
 * TODO: shadcn/uiのToastコンポーネントを使用して実装する
 */
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[300px] rounded-lg border p-4 shadow-lg backdrop-blur
            ${toast.variant === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
            ${toast.variant === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
            ${toast.variant === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : ''}
            ${toast.variant === 'default' ? 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900' : ''}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}