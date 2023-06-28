import { type FC, memo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { GPT_RUNNER_OFFICIAL_FOLDER, type MaybePromise, sleep } from '@nicepkg/gpt-runner-shared/common'
import { Trans, useTranslation } from 'react-i18next'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import toast from 'react-hot-toast'
import { initGptFiles } from '../../../../networks/gpt-files'
import { getGlobalConfig } from '../../../../helpers/global-config'
import { LoadingView } from '../../../../components/loading-view'
import { Badge, Title, Wrapper } from './init-gpt-files.styles'

export interface InitGptFilesProps {
  rootPath: string
  onCreated?: () => MaybePromise<void>
}

export const InitGptFiles: FC<InitGptFilesProps> = memo((props) => {
  const { rootPath, onCreated } = props

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: runInitGptFiles } = useMutation({
    mutationKey: ['initGptFiles', rootPath],
    mutationFn: () => initGptFiles({
      rootPath: getGlobalConfig().rootPath,
      gptFilesNames: ['copilot'],
    }),
  })

  const handleCreate = async () => {
    setIsLoading(true)

    try {
      await runInitGptFiles()
      await sleep(1000)
      await onCreated?.()
      toast.success(t('chat_page.toast_create_success'))
    }
    catch (err) {
      toast.error(`${t('chat_page.toast_create_error')}: ${err}`)
    }
    finally {
      setIsLoading(false)
    }
  }

  return <Wrapper>
    <Title>
      <Trans
        i18nKey='chat_page.no_gpt_files_tips'
        components={{
          Title: <Title />,
          Badge: <Badge />,
        }}
      ></Trans>
    </Title>

    <Title>
      <Trans
        i18nKey='chat_page.ask_for_create_gpt_file_tips'
        values={{
          fileName: `./${GPT_RUNNER_OFFICIAL_FOLDER}/copilot.gpt.md`,
        }}
        components={{
          Badge: <Badge />,
        }}
      ></Trans>
    </Title>

    <VSCodeButton
      appearance='primary'
      onClick={handleCreate}>{t('chat_page.confirm_create_btn')}</VSCodeButton>
    {isLoading && <LoadingView absolute></LoadingView>}
  </Wrapper>
})

InitGptFiles.displayName = 'InitGptFiles'
