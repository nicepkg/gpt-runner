import { type AnthropicModelConfig, ChatModelType, type SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { SelectOption } from '../../../../../../../components/select-option'
import { BaseModelSettings } from '../base-model-settings'
import type { BaseModelSettingsFormItemConfig, BaseModelSettingsProps } from '../base-model-settings'

interface FormData extends Pick<AnthropicModelConfig, 'modelName' | 'temperature' | 'maxTokens' | 'topP' | 'topK'> {

}

export interface AnthropicModelSettingsProps extends Omit<BaseModelSettingsProps<FormData>, 'modelType' | 'formConfig'> {
  singleFileConfig?: SingleFileConfig
}

export const AnthropicModelSettings: FC<AnthropicModelSettingsProps> = memo((props) => {
  const { rootPath, singleFileConfig } = props

  const { t } = useTranslation()

  const formConfig: BaseModelSettingsFormItemConfig<FormData>[] = [
    {
      name: 'modelName',
      buildView: ({ buildLabel, modelTipOptions, useFormReturns: { control, formState, watch, setValue } }) => {
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
      name: 'topK',
      buildView: ({ buildLabel, useFormReturns: { control, formState } }) => {
        return <>
          <HookFormInput
            name="topK"
            label={buildLabel(t('chat_page.top_k'))}
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
  ]

  return <BaseModelSettings
    rootPath={rootPath}
    modelType={ChatModelType.Anthropic}
    singleFileConfig={singleFileConfig}
    formConfig={formConfig}
  />
})

AnthropicModelSettings.displayName = 'AnthropicModelSettings'
