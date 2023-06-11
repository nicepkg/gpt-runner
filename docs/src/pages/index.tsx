import React from 'react'
import clsx from 'clsx'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl'
import Image from '@theme/IdealImage'
import Layout from '@theme/Layout'
import Tweet from '@site/src/components/Tweet'
import Tweets, { type TweetItem } from '@site/src/data/tweets'
import Quotes from '@site/src/data/quotes'
import Features, { type FeatureItem } from '@site/src/data/features'
import { ORG_NAME, PROJECT_NAME } from '@site/constants'
import styles from './styles.module.css'

function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <h1 className={styles.heroProjectTagline}>
          <img
            alt={translate({ message: 'GPT Runner' })}
            className={styles.heroLogo}
            src={useBaseUrl('/img/svg/logo.svg')}
            width="200"
            height="200"
          />
          <span
            className={styles.heroTitleTextHtml}
            dangerouslySetInnerHTML={{
              __html: translate({
                id: 'homepage.hero.title',
                message: 'Revolutionize your team\'s collaboration with <b>AI presets</b>',

                description:
                  'Home page hero title, can contain simple html tags',
              }),
            }}
          />
        </h1>
        <div className={styles.indexCtas}>
          <Link className="button button--primary" to="/docs">
            <Translate>Get Started</Translate>
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper} style={{
            transform: 'scale(1.8)',
            transformOrigin: 'left',
          }}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src={`https://ghbtns.com/github-btn.html?user=${ORG_NAME}&repo=${PROJECT_NAME}&type=star&count=true&size=large`}
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

function TweetsSection() {
  const tweetColumns: TweetItem[][] = [[], [], []]
  Tweets.filter(tweet => tweet.showOnHomepage).forEach((tweet, i) =>
    tweetColumns[i % 3]!.push(tweet),
  )

  return (
    <div className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2 className={clsx('margin-bottom--lg', 'text--center')}>
          <Translate>Loved by many engineers</Translate>
        </h2>
        <div className={clsx('row', styles.tweetsSection)}>
          {tweetColumns.map((tweetItems, i) => (
            <div className="col col--4" key={i}>
              {tweetItems.map(tweet => (
                <Tweet {...tweet} key={tweet.url} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuotesSection() {
  return (
    <div className={clsx(styles.section)}>
      <div className="container">
        <div className="row">
          {Quotes.map(quote => (
            <div className="col" key={quote.name}>
              <div className="avatar avatar--vertical margin-bottom--sm">
                <Image
                  alt={quote.name}
                  className="avatar__photo avatar__photo--xl"
                  img={quote.thumbnail}
                  style={{ overflow: 'hidden' }}
                />
                <div className="avatar__intro padding-top--sm">
                  <div className="avatar__name">{quote.name}</div>
                  <small className="avatar__subtitle">{quote.title}</small>
                </div>
              </div>
              <p className="text--center text--italic padding-horiz--md">
                {quote.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VideoContainer() {
  return (
    <div className="container text--center margin-bottom--xl">
      <div className="row">
        <div className="col">
          <h2>
            <Translate>Check it out in the intro video</Translate>
          </h2>
          <div className="video-container">
            <LiteYouTubeEmbed
              id="_An9EsKPhp0"
              params="autoplay=1&autohide=1&showinfo=0&rel=0"
              title="Explain Like I'm 5: GPT Runner"
              poster="maxresdefault"
              webp
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({
  feature,
  className,
}: {
  feature: FeatureItem
  className?: string
}) {
  const { withBaseUrl } = useBaseUrlUtils()

  return (
    <div className={clsx('col', className)}>
      <img
        className={styles.featureImage}
        alt={feature.title}
        width={Math.floor(feature.image.width)}
        height={Math.floor(feature.image.height)}
        src={withBaseUrl(feature.image.src)}
        loading="lazy"
      />
      <h3 className={clsx(styles.featureHeading)}>{feature.title}</h3>
      <p className="padding-horiz--md">{feature.text}</p>
    </div>
  )
}

function FeaturesContainer() {
  const firstRow = Features.slice(0, 3)
  const secondRow = Features.slice(3)

  return (
    <div className="container text--center">
      <h2>
        <Translate>Main features</Translate>
      </h2>
      <div className="row margin-bottom--lg">
        {firstRow.map((feature, idx) => (
          <Feature feature={feature} key={idx} />
        ))}
      </div>
      <div className="row">
        {secondRow.map((feature, idx) => (
          <Feature
            feature={feature}
            key={idx}
            className={clsx('col--4', idx === 0 && 'col--offset-2')}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home(): JSX.Element {
  const {
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext()
  const { description } = customFields as { description: string }
  return (
    <Layout title={tagline} description={description}>
      <main>
        <HeroBanner />
        <div className={styles.section}>
          {/* <VideoContainer /> */}
          <FeaturesContainer />
        </div>
        <TweetsSection />
        <QuotesSection />
      </main>
    </Layout>
  )
}
