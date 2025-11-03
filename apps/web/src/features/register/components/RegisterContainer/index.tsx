import { FlexBox } from '~/components/Base/FlexBox'
import { RegisterForm } from '~/features/register/components/RegisterForm'

export const RegisterContainer = (): React.ReactNode => {
  return (
    <FlexBox px={16} py={16} align="stretch">
      <RegisterForm />
    </FlexBox>
  )
}
