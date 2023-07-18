import { getModelConfigTypeSchema } from '@nicepkg/gpt-runner-shared/common'
import type { BaseModelConfig, ChatModelType, SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { StyledForm, StyledFormItem } from '../../settings.styles'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import { InlineFormItem, LabelWrapper } from './model-settings.styles'

export interface BaseModelSettingsFormItemBuildViewState<FormData extends BaseModelConfig> {
  buildLabel: (label: string) => ReactNode
  useFormReturns: UseFormReturn<FormData, any, undefined>
}

export interface BaseModelSettingsFormItemConfig<FormData extends BaseModelConfig> {
  name: keyof FormData
  buildView: (state: BaseModelSettingsFormItemBuildViewState<FormData>) => ReactNode
}

export interface BaseModelSettingsProps<FormData extends BaseModelConfig> {
  modelType: ChatModelType
  singleFileConfig?: SingleFileConfig
  formConfig: BaseModelSettingsFormItemConfig<FormData>[]
}

function BaseModelSettings_<FormData extends BaseModelConfig>(props: BaseModelSettingsProps<FormData>) {
  const { modelType, singleFileConfig, formConfig } = props

  const { t } = useTranslation()
  const { overrideModelsConfig, updateOverrideModelsConfig } = useGlobalStore()
  const modelFromSingleFileConfig = singleFileConfig?.model as FormData | undefined

  const currentModelType = modelType
  const currentModel = currentModelType === modelFromSingleFileConfig?.type ? modelFromSingleFileConfig : undefined
  const isUserConfigLoaded = singleFileConfig === undefined || singleFileConfig?.model !== undefined

  const isInitCheckMap = useRef(false)

  const currentModelOverrideConfig = useMemo(() => {
    return (overrideModelsConfig[currentModelType] || {}) as FormData
  }, [overrideModelsConfig[currentModelType]])

  const currentFormNames = useMemo(() => formConfig.map(item => item.name), [formConfig])

  const [checkedMap, setCheckedMap] = useState<Record<keyof FormData, boolean>>(currentFormNames.reduce((acc, name) => {
    acc[name] = false
    return acc
  }, {} as Record<keyof FormData, boolean>))

  const useFormReturns = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(getModelConfigTypeSchema(currentModelType, 'config')),
  })

  const { setValue, watch } = useFormReturns

  const updateOverrideModelsConfigFromCheckMap = useCallback((formData: FormData, _checkedMap?: Record<keyof FormData, boolean>) => {
    if (!isInitCheckMap.current)
      return

    const checkedValues = {} as FormData
    const finalCheckedMap = _checkedMap || checkedMap

    Object.keys(finalCheckedMap).forEach((key) => {
      const formName = key as keyof FormData
      if (finalCheckedMap[formName] === true)
        checkedValues[formName] = formData?.[formName] as any
    })

    updateOverrideModelsConfig(preState => ({
      ...preState,
      [currentModelType]: {
        ...checkedValues,
      },
    }))
  }, [checkedMap, isInitCheckMap.current])

  useEffect(() => {
    const subscription = watch((formData) => {
      updateOverrideModelsConfigFromCheckMap(formData as FormData)
    })

    return () => subscription.unsubscribe()
  }, [watch, updateOverrideModelsConfigFromCheckMap])

  // init
  useEffect(() => {
    if (isInitCheckMap.current || !isUserConfigLoaded || !currentModelOverrideConfig)
      return

    // init checked map
    const initCheckedMap = Object.keys(checkedMap).reduce((prev, key) => {
      const formName = key as keyof FormData
      const isOverride = currentModelOverrideConfig[formName] !== undefined
      prev[formName] = isOverride
      return prev
    }, {} as Record<keyof FormData, boolean>)

    setCheckedMap(initCheckedMap)

    Object.keys(initCheckedMap).forEach((key) => {
      const formName = key as keyof FormData
      const isOverride = initCheckedMap[formName]

      if (isOverride && currentModelOverrideConfig[formName] !== undefined)
        setValue(formName as Path<FormData>, currentModelOverrideConfig[formName] as any)

      if (!isOverride && currentModel?.[formName] !== undefined)
        setValue(formName as Path<FormData>, currentModel[formName] as any)
    })

    isInitCheckMap.current = true
  }, [isInitCheckMap.current, currentModel, isUserConfigLoaded, JSON.stringify(currentModelOverrideConfig)])

  const buildLabel = (label: string, formName: keyof FormData) => {
    return <LabelWrapper>
      <VSCodeCheckbox
        checked={checkedMap[formName]}
        onClick={(e) => {
          const newCheckedMap = {
            ...checkedMap,
            [formName]: !checkedMap[formName],
          }

          setCheckedMap(newCheckedMap)
          updateOverrideModelsConfigFromCheckMap(watch(), newCheckedMap)

          e.stopPropagation()
          return false
        }}
      >{label}</VSCodeCheckbox>
    </LabelWrapper>
  }

  const isAllChecked = Object.values(checkedMap).every(Boolean)
  return <StyledForm>
    <VSCodeCheckbox
      style={{
        marginBottom: '1rem',
      }}
      indeterminate={isAllChecked}
      checked={false}
      onClick={(e) => {
        const newCheckedMap = Object.fromEntries(Object.keys(checkedMap).map(key => [key, !isAllChecked])) as Record<keyof FormData, boolean>
        setCheckedMap(newCheckedMap)
        updateOverrideModelsConfigFromCheckMap(watch(), newCheckedMap)

        e.stopPropagation()
      }}
    >
      {t('chat_page.override_all_settings')}
    </VSCodeCheckbox>

    {formConfig.map((formItemConfig, index) => {
      const buildViewState: BaseModelSettingsFormItemBuildViewState<FormData> = {
        buildLabel: (label: string) => {
          return buildLabel(label, formItemConfig.name)
        },
        useFormReturns,
      }

      return (<StyledFormItem key={index}>
        <InlineFormItem>
          {formItemConfig.buildView(buildViewState)}
        </InlineFormItem>
      </StyledFormItem>)
    })}
  </StyledForm>
}

BaseModelSettings_.displayName = 'BaseModelSettings'

export const BaseModelSettings = memo(BaseModelSettings_)
