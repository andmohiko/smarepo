import type { NextPage } from 'next'

import { DefaultLayout } from '~/components/Layouts/DefaultLayout'

const IndexPage: NextPage = () => {
  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">テンプレート</h1>
      <p>だんらく</p>
      <span>すぱん</span>
      <span>すぱーん</span>
    </DefaultLayout>
  )
}

export default IndexPage
