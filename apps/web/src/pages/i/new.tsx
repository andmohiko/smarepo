import type { NextPage } from 'next'

import { NewContainer } from '~/features/new/components/NewContainer'
import { NonAuthLayout } from '~/components/Layouts/NonAuthLayout'

const NewPage: NextPage = () => {
  return (
    <NonAuthLayout>
      <NewContainer />
    </NonAuthLayout>
  )
}

export default NewPage
