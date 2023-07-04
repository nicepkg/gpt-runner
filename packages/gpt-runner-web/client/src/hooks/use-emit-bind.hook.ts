import { useEffect } from 'react'
import { ClientEventName, toUnixPath } from '@nicepkg/gpt-runner-shared/common'
import { emitter } from '../helpers/emitter'
import { useTempStore } from '../store/zustand/temp'
import { useOn } from './use-on.hook'

export function useEmitBind(deps: any[] = []) {
  const { updateIdeSelectedText, updateIdeOpeningFilePaths, updateIdeActiveFilePath } = useTempStore()

  useEffect(() => {
    emitter.emit(ClientEventName.InitSuccess)
  }, [])

  useOn({
    eventName: ClientEventName.UpdateIdeOpeningFiles,
    listener: ({ filePaths }) => {
      const unixFilePaths = filePaths?.map(toUnixPath)

      console.log('updateIdeOpeningFilePaths', unixFilePaths)
      updateIdeOpeningFilePaths(unixFilePaths)
    },
    deps: [...deps, updateIdeOpeningFilePaths],
  })

  useOn({
    eventName: ClientEventName.UpdateIdeActiveFilePath,
    listener: ({ filePath }) => {
      const unixFilePath = toUnixPath(filePath)

      console.log('updateIdeActiveFilePath', unixFilePath)
      updateIdeActiveFilePath(unixFilePath)
    },
    deps: [...deps, updateIdeActiveFilePath],
  })

  useOn({
    eventName: ClientEventName.UpdateUserSelectedText,
    listener: ({ text }) => {
      updateIdeSelectedText(text)
    },
    deps: [...deps, updateIdeSelectedText],
  })
}
