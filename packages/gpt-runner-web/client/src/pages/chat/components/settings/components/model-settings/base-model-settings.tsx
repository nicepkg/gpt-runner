import { ChatModelType, getModelConfigTypeSchema } from '@nicepkg/gpt-runner-shared/common'
import type { BaseModelConfig, SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
  singleFileConfig?: SingleFileConfig
  formConfig: BaseModelSettingsFormItemConfig<FormData>[]
}

function BaseModelSettings_<FormData extends BaseModelConfig>(props: BaseModelSettingsProps<FormData>) {
  const { singleFileConfig, formConfig } = props

  const { t } = useTranslation()
  const { modelOverrideConfig, updateModelOverrideConfig } = useGlobalStore()
  const currentModel = singleFileConfig?.model as FormData | undefined
  const currentModelType = currentModel?.type || ChatModelType.Openai

  const currentModelOverrideConfig = useMemo(() => {
    return (modelOverrideConfig[currentModelType] || {}) as FormData
  }, [modelOverrideConfig[currentModelType]])

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

  const updateModelOverrideConfigFromCheckMap = useCallback((formData: FormData) => {
    const checkedValues = {} as FormData

    Object.keys(checkedMap).forEach((key) => {
      const formName = key as keyof FormData
      if (checkedMap[formName] === true)
        checkedValues[formName] = formData?.[formName] as any
    })

    updateModelOverrideConfig(preState => ({
      ...preState,
      [currentModelType]: {
        ...checkedValues,
      },
    }))
  }, [checkedMap])

  useEffect(() => {
    const subscription = watch((formData) => {
      updateModelOverrideConfigFromCheckMap(formData as FormData)
    })

    return () => subscription.unsubscribe()
  }, [watch, updateModelOverrideConfigFromCheckMap])

  useEffect(() => {
    // update checked map
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
  }, [singleFileConfig?.model, JSON.stringify(currentModelOverrideConfig)])

  const buildLabel = (label: string, formName: keyof FormData) => {
    return <LabelWrapper>
      <VSCodeCheckbox
        checked={checkedMap[formName]}
        onChange={(e) => {
          const checked = (e.target as HTMLInputElement).checked
          setCheckedMap(prev => ({
            ...prev,
            [formName]: checked,
          }))
          updateModelOverrideConfigFromCheckMap(watch())
          e.stopPropagation()
          return false
        }}
      >{label}</VSCodeCheckbox>
    </LabelWrapper>
  }

  return <StyledForm>
    <VSCodeCheckbox
      style={{
        marginBottom: '1rem',
      }}
      checked={Object.values(checkedMap).every(Boolean)}
      onChange={(e) => {
        const checked = (e.target as HTMLInputElement).checked
        setCheckedMap((prev) => {
          return Object.fromEntries(Object.keys(prev).map(key => [key, checked])) as Record<keyof FormData, boolean>
        })
        updateModelOverrideConfigFromCheckMap(watch())
        e.stopPropagation()
      }}
    >
      Override All Settings
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
