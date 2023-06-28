import type { FC } from 'react'
import { Fragment, memo } from 'react'
import { VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { useTranslation } from 'react-i18next'
import pkg from '../../../../../../../../package.json'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import { useConfetti } from '../../../../../../hooks/use-confetti.hook'
import { AboutWrapper, Content, List, ListItem, StyledLogo, Title } from './about.styles'

export const About: FC = memo(() => {
  const { t } = useTranslation()
  const { langId } = useGlobalStore()
  const { runConfettiAnime } = useConfetti()
  const version = pkg.version
  const githubLink = pkg.repository.url
  const enBuyMeACoffeeLink = 'https://bmc.link/jinmingyang'
  const cnBuyMeACoffeeLink = 'https://github.com/nicepkg/gpt-runner/assets/35005637/98a4962a-8a2e-4177-8781-1e1ee886ecdc'
  const buyMeACoffeeLink = langId === LocaleLang.ChineseSimplified ? cnBuyMeACoffeeLink : enBuyMeACoffeeLink

  const data: { title: React.ReactNode; content?: React.ReactNode }[] = [
    { title: t('chat_page.version'), content: version },
    { title: t('chat_page.github'), content: <VSCodeLink target='_blank' href={githubLink}>nicepkg/gpt-runner</VSCodeLink> },
    { title: t('chat_page.reward'), content: <VSCodeLink target='_blank' href={buyMeACoffeeLink} onClick={runConfettiAnime}>{t('chat_page.buy_me_a_coffee')}</VSCodeLink> },
    { title: t('chat_page.contributors') },
    {
      title: <div
        style={{ userSelect: 'none', width: '100%' }}
        onClick={runConfettiAnime}>
        <img src="https://contrib.rocks/image?repo=nicepkg/vr360" style={{
          maxWidth: '100%',
        }} />
      </div>,
    },
  ]

  return (
    <AboutWrapper>
      <StyledLogo onClick={runConfettiAnime}></StyledLogo>
      <List>
        {data.map((item, index) => (
          <Fragment key={index}>
            <ListItem>
              <Title>{item.title}</Title>
              <Content>{item.content}</Content>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </AboutWrapper>
  )
})

About.displayName = 'About'
