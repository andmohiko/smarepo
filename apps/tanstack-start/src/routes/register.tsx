import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { useFirebaseAuth } from '#/providers/FirebaseAuthProvider'
import { useMyProfile } from '#/hooks/useMyProfile'
import { useCreateProfileMutation } from '#/features/profile/hooks/useCreateProfileMutation'
import { createProfileSchema, type CreateProfileInputType } from '#/features/profile/types'
import { isUsernameAvailableOperation } from '#/infrastructure/firestore/ProfileOperations'
import { fighters, type FighterId } from '@smarepo/common'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { user, uid } = useFirebaseAuth()
  const { profile, loading: profileLoading } = useMyProfile()
  const { createProfile, isLoading } = useCreateProfileMutation()
  const navigate = Route.useNavigate()

  // プロフィールが既に存在する場合はホームへリダイレクト
  useEffect(() => {
    if (!profileLoading && profile) {
      navigate({ to: '/' })
    }
  }, [profile, profileLoading, navigate])

  // フォーム設定
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateProfileInputType>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      username: '',
      xId: '',
      profileImageUrl: user?.photoURL || '',
      mainFighterIds: [],
    },
  })

  const selectedFighters = watch('mainFighterIds')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // ユーザー名の重複チェック
  const checkUsername = async (username: string) => {
    if (username.length < 5 || username.length > 15) return

    setIsCheckingUsername(true)
    try {
      const isAvailable = await isUsernameAvailableOperation(username, uid)
      if (!isAvailable) {
        setError('username', {
          type: 'manual',
          message: 'このユーザー名は既に使用されています',
        })
      }
    } catch (error) {
      console.error('ユーザー名チェックエラー:', error)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // ファイター選択の切り替え
  const toggleFighter = (fighterId: string) => {
    const current = selectedFighters || []
    if (current.includes(fighterId)) {
      setValue('mainFighterIds', current.filter(id => id !== fighterId))
    } else {
      setValue('mainFighterIds', [...current, fighterId])
    }
  }

  // フォーム送信
  const onSubmit = async (data: CreateProfileInputType) => {
    await createProfile(data)
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-3xl font-bold">プロフィール作成</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
            {/* 表示名 */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                表示名 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('displayName')}
                type="text"
                className="w-full rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
                placeholder="スマレポ太郎"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            {/* ユーザー名 */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                ユーザー名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  {...register('username')}
                  type="text"
                  className="w-full rounded-lg border pl-8 pr-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="smarepo_user"
                  onBlur={(e) => checkUsername(e.target.value)}
                />
                {isCheckingUsername && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    確認中...
                  </span>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                5〜15文字の英数字とアンダースコアのみ
              </p>
            </div>

            {/* X ID */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                X (Twitter) ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  {...register('xId')}
                  type="text"
                  className="w-full rounded-lg border pl-8 pr-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="your_x_id"
                />
              </div>
              {errors.xId && (
                <p className="mt-1 text-sm text-red-500">{errors.xId.message}</p>
              )}
            </div>

            {/* プロフィール画像URL */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                プロフィール画像URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  {...register('profileImageUrl')}
                  type="text"
                  className="flex-1 rounded-lg border px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {watch('profileImageUrl') && (
                  <img
                    src={watch('profileImageUrl')}
                    alt="プロフィール画像"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
              </div>
              {errors.profileImageUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.profileImageUrl.message}</p>
              )}
            </div>

            {/* メインファイター選択 */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                メインファイター <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-4 max-h-60 overflow-y-auto">
                {Object.entries(fighters).map(([id, fighter]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleFighter(id)}
                    className={`
                      flex flex-col items-center p-2 rounded-lg transition-colors
                      ${selectedFighters?.includes(id)
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span className="text-2xl">{fighter.icon}</span>
                    <span className="text-xs mt-1">{fighter.name}</span>
                  </button>
                ))}
              </div>
              {errors.mainFighterIds && (
                <p className="mt-1 text-sm text-red-500">{errors.mainFighterIds.message}</p>
              )}
              {selectedFighters && selectedFighters.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  選択中: {selectedFighters.map(id => fighters[id as FighterId].name).join(', ')}
                </p>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || isCheckingUsername}
                className="w-full max-w-sm"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    作成中...
                  </span>
                ) : (
                  'プロフィールを作成'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}