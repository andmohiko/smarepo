import Head from 'next/head'

export const PageHead = (): React.ReactElement => (
  <Head>
    <title>スマレポ</title>
    <meta name="description" content="スマブラ戦績記録・分析アプリ" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />

    {/* favicon */}
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    {/* OGP */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@andmohiko" />
    <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
    <meta property="og:title" content="スマレポ" />
    <meta property="og:description" content="スマブラ戦績記録・分析アプリ" />
    <meta property="og:site_name" content="スマレポ" />
    <meta
      property="og:image"
      content={`${process.env.NEXT_PUBLIC_APP_URL}/images/ogp.png`}
    />
    <meta name="twitter:domain" content={process.env.NEXT_PUBLIC_APP_URL} />
    <meta name="twitter:title" content="スマレポ" />
    <meta name="twitter:description" content="スマブラ戦績記録・分析アプリ" />
    <meta
      name="twitter:image"
      content={`${process.env.NEXT_PUBLIC_APP_URL}/images/ogp.png`}
    />
  </Head>
)
