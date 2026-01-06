import { LoadingProvider } from './LoadingProvider'
import { MantineProvider } from './MantineProvider'
import { FirebaseAuthProvider } from './FirebaseAuthProvider'

type Props = {
  children: React.ReactNode
}

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <MantineProvider>
      <LoadingProvider>
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
      </LoadingProvider>
    </MantineProvider>
  )
}
