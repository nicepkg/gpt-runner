import { type FC, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { GPT_RUNNER_OFFICIAL_FOLDER, type MaybePromise, sleep } from '@nicepkg/gpt-runner-shared/common'
import { IconButton } from '../../../../components/icon-button'
import { initGptFiles } from '../../../../networks/gpt-files'
import { getGlobalConfig } from '../../../../helpers/global-config'
import { LoadingView } from '../../../../components/loading-view'
import { StyledVSCodeTag, Title, Wrapper } from './init-gpt-files.styles'

export interface InitGptFilesProps {
  rootPath: string
  onCreated?: () => MaybePromise<void>
}

export const InitGptFiles: FC<InitGptFilesProps> = (props) => {
  const { rootPath, onCreated } = props
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
    }
    finally {
      setIsLoading(false)
    }
  }

  return <Wrapper>
    <Title>
      There is no
      <StyledVSCodeTag>xxx.gpt.md</StyledVSCodeTag>
      file in the current directory.
    </Title>
    <Title>
      Do you need to create a
      <StyledVSCodeTag>./{GPT_RUNNER_OFFICIAL_FOLDER}/copilot.gpt.md</StyledVSCodeTag>
      file?
    </Title>
    <IconButton
      text='Yes, Create'
      hoverShowText={false}
      iconClassName='codicon-new-file'
      onClick={handleCreate}></IconButton>
    {isLoading && <LoadingView absolute></LoadingView>}
  </Wrapper>
}

InitGptFiles.displayName = 'InitGptFiles'
