import { useQuery } from '@tanstack/react-query'
import { getGptFileInfo } from '../networks/gpt-files'

export interface UseUserConfigProps {
  rootPath?: string
  singleFilePath?: string
  enabled?: boolean
}

export function useUserConfig(props: UseUserConfigProps) {
  const { rootPath, singleFilePath, enabled = true } = props
  const queryEnabled = !!singleFilePath && !!rootPath && enabled

  const { data: getGptFileInfoRes, isLoading } = useQuery({
    queryKey: ['settings-gpt-file-info', singleFilePath],
    enabled: queryEnabled,
    queryFn: () => getGptFileInfo({
      rootPath: rootPath!,
      filePath: singleFilePath!,
    }),
  })

  const { userConfig, singleFileConfig } = getGptFileInfoRes?.data || {}

  return {
    isLoading: queryEnabled ? isLoading : false,
    userConfig,
    singleFileConfig,
  }
}
