import { useMutation, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { memo, useMemo } from 'react'
import type { MarkAsVisitedAppConfigReqParams } from '@nicepkg/gpt-runner-shared/common'
import { useTempStore } from '../../store/zustand/temp'
import { useGlobalStore } from '../../store/zustand/global'
import { fetchAppConfig, markAsVisitedAppConfig } from '../../networks/config'
import { Modal } from '../../components/modal'
import { MessageTextView } from '../../components/chat-message-text-view'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = memo((props: LayoutProps) => {
  const { children } = props
  const { currentAppConfig, updateCurrentAppConfig } = useTempStore()
  const { langId } = useGlobalStore()

  // update app config
  useQuery({
    queryKey: ['app-config', langId],
    enabled: !!langId,
    queryFn: () => fetchAppConfig({
      langId,
    }),
    onSuccess(data) {
      const currentAppConfig = data.data

      if (currentAppConfig)
        updateCurrentAppConfig(currentAppConfig)
    },
  })

  const { mutate: markVisitedModal } = useMutation({
    mutationFn: (params: MarkAsVisitedAppConfigReqParams) => markAsVisitedAppConfig(params),
  })

  const notificationConfig = currentAppConfig?.currentConfig?.notificationConfig
  const releaseConfig = currentAppConfig?.currentConfig?.releaseConfig

  const releaseLog = useMemo(() => {
    let content = ''
    releaseConfig?.changeLogs.forEach((log) => {
      content += `## ${log.version}\n`
      content += `${log.changes}\n\n`
    })
    return content
  }, [releaseConfig?.changeLogs])

  return <>
    {/* notification modal */}
    <Modal
      zIndex={99}
      open={Boolean(currentAppConfig?.showNotificationModal)}
      title={notificationConfig?.title || ''}
      showCancelBtn={false}
      showOkBtn={false}
      contentStyle={{
        minHeight: '80vh',
      }}
      onCancel={() => {
        markVisitedModal({
          types: ['notificationDate'],
        })
        updateCurrentAppConfig({
          showNotificationModal: false,
        })
      }}
    >
      <MessageTextView
        contents={notificationConfig?.message || ''} />
    </Modal>

    {/* release log modal */}
    <Modal
      zIndex={100}
      open={Boolean(currentAppConfig?.showReleaseModal)}
      title={'Release Log'}
      showCancelBtn={false}
      showOkBtn={false}
      contentStyle={{
        minHeight: '80vh',
      }}
      onCancel={() => {
        markVisitedModal({
          types: ['releaseDate'],
        })
        updateCurrentAppConfig({
          showReleaseModal: false,
        })
      }}
    >
      <MessageTextView
        contents={releaseLog} />
    </Modal>

    {children}
  </>
})

Layout.displayName = 'Layout'
