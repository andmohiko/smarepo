import Image from 'next/image'
import { HeadingText } from '~/components/Typography/HeadingText'
import { ParagraphText } from '~/components/Typography/ParagraphText'
import styles from './style.module.css'

export const NewContainer = (): React.ReactNode => {
  return (
    <div className={styles.newContainer}>
      <div className={styles.hero}>
        <div className={styles.heroTexts}>
          <HeadingText size="sm" color="black">
            スマブラ
            <br />
            戦績記録・分析アプリ
          </HeadingText>
          <HeadingText size="lg" color="black">
            スマレポ
          </HeadingText>
          <ParagraphText color="black">
            対戦の戦績を記録して
            <br />
            自分のマッチアップを分析しよう！
          </ParagraphText>
        </div>
        <Image
          src="/images/ui/matches.webp"
          width={458}
          height={920}
          alt="スマレポ"
          className={styles.heroImage}
        />
      </div>

      <div className={styles.section}>
        <Image
          src="/images/ui/createMatch.webp"
          width={458}
          height={920}
          alt="スマレポ"
          className={styles.sectionImage}
        />
        <div className={styles.sectionTexts}>
          <HeadingText size="sm" color="black">
            戦績の入力 ✏️
          </HeadingText>
          <ParagraphText color="black">
            スマレポではスマブラのオンライン対戦の戦績を記録することができます。
            <br />
            自分のファイターと相手のファイターと勝敗の他に、ステージや世界戦闘力も記録することができます。
          </ParagraphText>
        </div>
      </div>

      <div className={styles.section}>
        <Image
          src="/images/ui/matches.webp"
          width={458}
          height={920}
          alt="スマレポ"
          className={styles.sectionImage}
        />
        <div className={styles.sectionTexts}>
          <HeadingText size="sm" color="black">
            戦績の記録 📈
          </HeadingText>
          <ParagraphText color="black">
            記録した戦績はいつでも見返すことができます。
            <br />
            また、戦績を分析することで自分のマッチアップを分析することができます。
          </ParagraphText>
        </div>
      </div>

      <div className={styles.section}>
        <Image
          src="/images/ui/profile.webp"
          width={458}
          height={920}
          alt="スマレポ"
          className={styles.sectionImage}
        />
        <div className={styles.sectionTexts}>
          <HeadingText size="sm" color="black">
            プロフィールのシェア 🌍
          </HeadingText>
          <ParagraphText color="black">
            プロフィールを入力すると、他のユーザーに公開することができます。
            <br />
            プロフィールの項目は今後追加されていきます。
          </ParagraphText>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTexts}>
          <HeadingText size="sm" color="black">
            今後追加予定の機能 🚀
          </HeadingText>
          <ParagraphText color="black">
            スマレポは今後も機能を追加していく予定です。
            <br />
            現在追加予定の機能としては以下のようなものがあります。
            <br />
            ・ファイターごとの分析機能
            <br />
            ・プロフィールのSNSシェア機能
            <br />
            ・iOS・Android版のアプリリリース
          </ParagraphText>
        </div>
      </div>
    </div>
  )
}
