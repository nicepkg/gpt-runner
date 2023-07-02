import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useGlobalStore } from '../store/zustand/global'
import { fetchCommonFilesTree } from '../networks/common-files'
import { useTempStore } from '../store/zustand/temp'

export interface UseGetCommonFilesTreeProps {
  rootPath: string
  syncChangeToStore?: boolean
}
export function useGetCommonFilesTree(props: UseGetCommonFilesTreeProps) {
  const { rootPath, syncChangeToStore = true } = props
  const { excludeFileExts } = useGlobalStore()
  const { handleFetchCommonFilesTreeResChange } = useTempStore()

  const useQueryReturns = useQuery({
    queryKey: ['file-tree', rootPath, excludeFileExts.join(',')],
    enabled: !!rootPath,
    queryFn: () => fetchCommonFilesTree({
      rootPath,
      excludeExts: excludeFileExts,
    }),
  })

  useEffect(() => {
    if (!syncChangeToStore)
      return
    handleFetchCommonFilesTreeResChange(useQueryReturns.data)
  }, [useQueryReturns.data, syncChangeToStore])

  return useQueryReturns
}
