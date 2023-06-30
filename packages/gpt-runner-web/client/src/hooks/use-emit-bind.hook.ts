import { useEffect } from 'react'
import { ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../store/zustand/global'
import { emitter } from '../helpers/emitter'
import { useOn } from './use-on.hook'

export function useEmitBind(deps: any[] = []) {
  const { updateIdeOpeningFilePaths, updateIdeActiveFilePath } = useGlobalStore()

  useEffect(() => {
    emitter.emit(ClientEventName.InitSuccess)
  }, [])

  useOn({
    eventName: ClientEventName.UpdateIdeOpeningFiles,
    listener: ({ filePaths }) => {
      console.log('updateIdeOpeningFilePaths', filePaths)
      updateIdeOpeningFilePaths(filePaths)
    },
    deps: [...deps, updateIdeOpeningFilePaths],
  })

  useOn({
    eventName: ClientEventName.UpdateIdeActiveFilePath,
    listener: ({ filePath }) => {
      console.log('updateIdeActiveFilePath', filePath)
      updateIdeActiveFilePath(filePath)
    },
    deps: [...deps, updateIdeActiveFilePath],
  })
}
