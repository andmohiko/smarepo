import { createContext, useContext, useState } from 'react'

type AnalyticsSettings = {
  isGroupDashFighters: boolean
}

const defaultAnalyticsSettings: AnalyticsSettings = {
  isGroupDashFighters: true,
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
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>(
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
