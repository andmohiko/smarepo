import { createContext, useContext } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'

type AnalyticsSettings = {
  isGroupDashFighters: boolean
}

/** ローカルストレージのキー: 分析設定 */
const STORAGE_KEY_ANALYTICS_SETTINGS = 'analytics_settings'

const defaultAnalyticsSettings: AnalyticsSettings = {
  isGroupDashFighters: false,
}

const AnalyticsSettingsContext = createContext<{
  analyticsSettings: AnalyticsSettings
  setAnalyticsSettings: (analyticsSettings: AnalyticsSettings) => void
}>({
  analyticsSettings: defaultAnalyticsSettings,
  setAnalyticsSettings: () => {},
})

const AnalyticsSettingsProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [analyticsSettings, setAnalyticsSettings] =
    useLocalStorage<AnalyticsSettings>(
      STORAGE_KEY_ANALYTICS_SETTINGS,
      defaultAnalyticsSettings,
    )

  return (
    <AnalyticsSettingsContext.Provider
      value={{
        analyticsSettings,
        setAnalyticsSettings,
      }}
    >
      {children}
    </AnalyticsSettingsContext.Provider>
  )
}

const useAnalyticsSettingsContext = () => {
  return useContext(AnalyticsSettingsContext)
}

export {
  AnalyticsSettingsContext,
  AnalyticsSettingsProvider,
  useAnalyticsSettingsContext,
}
