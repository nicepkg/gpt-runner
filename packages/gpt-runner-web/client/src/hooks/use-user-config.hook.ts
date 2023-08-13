import { useQuery } from '@tanstack/react-query'
import { getGptFileInfo } from '../networks/gpt-files'

export interface UseUserConfigProps {
  rootPath?: string
  aiPresetFilePath?: string
  enabled?: boolean
}

export function useUserConfig(props: UseUserConfigProps) {
  const { rootPath, aiPresetFilePath, enabled = true } = props
  const queryEnabled = !!aiPresetFilePath && !!rootPath && enabled

  const { data: getGptFileInfoRes, isLoading } = useQuery({
    queryKey: ['settings-gpt-file-info', aiPresetFilePath],
    enabled: queryEnabled,
    queryFn: () => getGptFileInfo({
      rootPath: rootPath!,
      filePath: aiPresetFilePath!,
    }),
  })

  const { userConfig, aiPresetFileConfig } = getGptFileInfoRes?.data || {}

  return {
    isLoading: queryEnabled ? isLoading : false,
    userConfig,
    aiPresetFileConfig,
  }
}
