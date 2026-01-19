import { AnalyticsSettingsProvider } from './AnalyticsSettingsProvider'
import { FirebaseAuthProvider } from './FirebaseAuthProvider'
import { LoadingProvider } from './LoadingProvider'
import { MantineProvider } from './MantineProvider'

type Props = {
  children: React.ReactNode
}

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <MantineProvider>
      <LoadingProvider>
        <FirebaseAuthProvider>
          <AnalyticsSettingsProvider>{children}</AnalyticsSettingsProvider>
        </FirebaseAuthProvider>
      </LoadingProvider>
    </MantineProvider>
  )
}
