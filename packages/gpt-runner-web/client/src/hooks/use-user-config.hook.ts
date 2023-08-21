import { useQuery } from '@tanstack/react-query'
import { getGptFileInfo } from '../networks/gpt-files'

export interface UseGlobalAiPersonConfigProps {
  rootPath?: string
  aiPersonFileSourcePath?: string
  enabled?: boolean
}

export function useGlobalAiPersonConfig(props: UseGlobalAiPersonConfigProps) {
  const { rootPath, aiPersonFileSourcePath, enabled = true } = props
  const queryEnabled = !!aiPersonFileSourcePath && !!rootPath && enabled

  const { data: getGptFileInfoRes, isLoading } = useQuery({
    queryKey: ['settings-gpt-file-info', aiPersonFileSourcePath],
    enabled: queryEnabled,
    queryFn: () => getGptFileInfo({
      rootPath: rootPath!,
      filePath: aiPersonFileSourcePath!,
    }),
  })

  const { globalAiPersonConfig, aiPersonConfig } = getGptFileInfoRes?.data || {}

  return {
    isLoading: queryEnabled ? isLoading : false,
    globalAiPersonConfig,
    aiPersonConfig,
  }
}
