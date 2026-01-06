import type { NextPage } from 'next'

import { RegisterContainer } from '~/features/register/components/RegisterContainer'
import { SimpleLayout } from '~/components/Layouts/SimpleLayout'

const RegisterPage: NextPage = () => {
  return (
    <SimpleLayout>
      <RegisterContainer />
    </SimpleLayout>
  )
}

export default RegisterPage
