import { ChatModelType, type OpenaiModelConfig, type SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { type ISelectOption, SelectOption } from '../../../../../../../components/select-option'
import { BaseModelSettings, type BaseModelSettingsFormItemConfig } from '../base-model-settings'

interface FormData extends Pick<OpenaiModelConfig, 'modelName' | 'temperature' | 'maxTokens' | 'topP' | 'frequencyPenalty' | 'presencePenalty'> {

}

export interface OpenaiModelSettingsProps {
  singleFileConfig?: SingleFileConfig
}

export const OpenaiModelSettings: FC<OpenaiModelSettingsProps> = memo((props) => {
  const { singleFileConfig } = props

  const { t } = useTranslation()

  const [modelTipOptions] = useState<ISelectOption[]>([
    {
      label: 'gpt-3.5-turbo-16k',
      value: 'gpt-3.5-turbo-16k',
    },
    {
      label: 'gpt-4',
      value: 'gpt-4',
    },
    {
      label: 'gpt-4-32k',
      value: 'gpt-4-32k',
    },
    {
      label: 'gpt-3.5-turbo',
      value: 'gpt-3.5-turbo',
    },
  ])

  const formConfig: BaseModelSettingsFormItemConfig<FormData>[] = [
    {
      name: 'modelName',
      buildView: ({ buildLabel, useFormReturns: { control, formState, watch, setValue } }) => {
        return <>
          <HookFormInput
            name="modelName"
            label={buildLabel(t('chat_page.model_name'))}
            labelInLeft
            placeholder={''}
            errors={formState.errors}
            control={control}
          />
          <SelectOption
            options={modelTipOptions}
            value={watch('modelName')}
            onChange={(value) => {
              setValue('modelName', value)
            }} />
        </>
      },
    },
    {
      name: 'temperature',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="temperature"
            label={buildLabel(t('chat_page.temperature'))}
            labelInLeft
            isNumber
            placeholder={'0 ~ 1'}
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
    {
      name: 'maxTokens',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="maxTokens"
            label={buildLabel(t('chat_page.max_tokens'))}
            labelInLeft
            isNumber
            minNumber={0}
            placeholder={'0 ~ 2048'}
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
    {
      name: 'topP',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="topP"
            label={buildLabel(t('chat_page.top_p'))}
            labelInLeft
            minNumber={0}
            maxNumber={1}
            placeholder={'0 ~ 1'}
            isNumber
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
    {
      name: 'frequencyPenalty',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="frequencyPenalty"
            label={buildLabel(t('chat_page.frequency_penalty'))}
            labelInLeft
            isNumber
            minNumber={-2}
            maxNumber={2}
            placeholder={'-2 ~ 2'}
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
    {
      name: 'presencePenalty',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="presencePenalty"
            label={buildLabel(t('chat_page.presence_penalty'))}
            labelInLeft
            isNumber
            minNumber={-2}
            maxNumber={2}
            placeholder={'-2 ~ 2'}
            errors={formState.errors}
            control={control}
          />
        </>
      },
    },
  ]

  return <BaseModelSettings
    modelType={ChatModelType.Openai}
    singleFileConfig={singleFileConfig}
    formConfig={formConfig}
  />
})

OpenaiModelSettings.displayName = 'OpenaiModelSettings'
