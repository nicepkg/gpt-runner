import type { ModelApiVendor } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType, ServerStorageName, getModelConfigTypeSchema } from '@nicepkg/gpt-runner-shared/common'
import { memo, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type { Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { StyledForm, StyledFormItem } from '../../settings.styles'
import { getServerStorage, saveServerStorage } from '../../../../../../networks/server-storage'
import { IS_SAFE } from '../../../../../../helpers/constant'
import { useLoading } from '../../../../../../hooks/use-loading.hook'
import { HookFormSelect } from '../../../../../../components/hook-form/hook-form-select'
import { useTempStore } from '../../../../../../store/zustand/temp'
import { useGlobalStore } from '../../../../../../store/zustand/global'

export interface BaseSecretsFormData {
  vendorName: string
}

export interface BaseSecretsSettingsFormItemBuildViewState<FormData extends BaseSecretsFormData, M extends ChatModelType = ChatModelType.Openai> {
  useFormReturns: UseFormReturn<FormData, any, undefined>
  currentVendorConfig: ModelApiVendor<M> | null
}

export interface BaseSecretsSettingsFormItemConfig<FormData extends BaseSecretsFormData> {
  name: keyof FormData
  buildView: (state: BaseSecretsSettingsFormItemBuildViewState<FormData>) => ReactNode
}

export interface BaseSecretsSettingsProps<FormData extends BaseSecretsFormData, M extends ChatModelType = ChatModelType.Openai> {
  modelType?: M
  formConfig: BaseSecretsSettingsFormItemConfig<FormData>[]
}

function BaseSecretsSettings_<FormData extends BaseSecretsFormData, M extends ChatModelType = ChatModelType.Openai>(props: BaseSecretsSettingsProps<FormData, M>) {
  const { modelType, formConfig } = props

  const { t } = useTranslation()
  const { setLoading } = useLoading()
  const { currentAppConfig } = useTempStore()
  const { modelTypeVendorNameMap, updateModelTypeVendorName } = useGlobalStore()

  const currentModelType = modelType || ChatModelType.Openai

  const vendorsConfig = useMemo(() => {
    return currentAppConfig?.currentConfig?.vendorsConfig?.[currentModelType]
  }, [currentAppConfig, currentModelType])

  const vendorNameConfigMap = useMemo(() => {
    const map: Record<string, ModelApiVendor<typeof currentModelType>> = {}

    vendorsConfig?.forEach((item) => {
      map[item.vendorName] = item
    })

    return map
  }, [vendorsConfig])

  const vendorSelectOptions = useMemo(() => {
    const options = vendorsConfig?.map((item) => {
      return {
        label: item.vendorName,
        value: item.vendorName,
      }
    }) ?? []

    options.unshift({
      label: t('chat_page.custom'),
      value: '',
    })

    return options
  }, [vendorsConfig, t])

  const { data: querySecretsRes, refetch: refetchSecretes } = useQuery({
    queryKey: ['secrets', currentModelType],
    enabled: !!currentModelType,
    queryFn: () => getServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: currentModelType!,
    }),
  })

  const { mutateAsync: saveSecrets } = useMutation({
    mutationFn: (value: FormData) => saveServerStorage({
      storageName: ServerStorageName.SecretsConfig,
      key: currentModelType,
      value,
    }),
  })

  const remoteSecrets = querySecretsRes?.data?.value as FormData | undefined

  const useFormReturns = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(getModelConfigTypeSchema(currentModelType, 'secrets')),
    defaultValues: {
      vendorName: modelTypeVendorNameMap[currentModelType] || '',
    } as any,
  })

  const { handleSubmit, setValue, watch, formState, control } = useFormReturns

  const currentVendorName = watch('vendorName' as any)
  const currentVendorConfig = useMemo(() => {
    return vendorNameConfigMap[currentVendorName] || null
  }, [currentVendorName]) as ModelApiVendor<M> | null

  useEffect(() => {
    const finalSecrets = currentVendorConfig?.vendorSecrets || remoteSecrets

    if (finalSecrets) {
      Object.keys(finalSecrets).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setValue(key as Path<FormData>, finalSecrets[key])
      })
    }
  }, [remoteSecrets, currentVendorConfig])

  useEffect(() => {
    updateModelTypeVendorName(currentModelType, currentVendorName)
  }, [currentModelType, currentVendorName])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    try {
      await saveSecrets(data)
      await refetchSecretes()
      toast.success(t('chat_page.toast_save_success'))
    }
    finally {
      setLoading(false)
    }
  }

  return <StyledForm onSubmit={handleSubmit(onSubmit)}>
    {IS_SAFE && <StyledFormItem key={-1}>
      <HookFormSelect
        label={t('chat_page.third_party_api_providers')}

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        name="vendorName"
        errors={formState.errors}
        options={vendorSelectOptions}
        control={control}
      />
    </StyledFormItem>}

    {formConfig.map((formItemConfig, index) => {
      const buildViewState: BaseSecretsSettingsFormItemBuildViewState<FormData> = {
        useFormReturns,
        currentVendorConfig,
      }
      return <StyledFormItem key={index}>
        {formItemConfig.buildView(buildViewState)}
      </StyledFormItem>
    })}

    <VSCodeButton
      disabled={!IS_SAFE || Boolean(currentVendorConfig?.vendorSecrets)}
      appearance='primary'
      type='submit'
    >
      {IS_SAFE ? t('chat_page.save_btn') : t('chat_page.disabled_save_secrets_config_btn')}
    </VSCodeButton>
  </StyledForm>
}

BaseSecretsSettings_.displayName = 'BaseSecretsSettings'

export const BaseSecretsSettings = memo(BaseSecretsSettings_)
