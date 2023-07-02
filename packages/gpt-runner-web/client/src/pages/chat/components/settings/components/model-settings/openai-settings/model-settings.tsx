import type { OpenaiModelConfig, SingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { memo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HookFormInput } from '../../../../../../../components/hook-form/hook-form-input'
import { type ISelectOption, SelectOption } from '../../../../../../../components/select-option'
import { BaseModelSettings, type BaseModelSettingsFormItemConfig } from '../base-model-settings'

export interface FormData extends Pick<OpenaiModelConfig, 'modelName' | 'temperature' | 'maxTokens' | 'topP' | 'frequencyPenalty' | 'presencePenalty'> {

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
            label={buildLabel('Model Name')}
            labelInLeft
            placeholder={''}
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
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
            label={buildLabel('Temperature')}
            labelInLeft
            isNumber
            placeholder={'0 ~ 1'}
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
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
            label={buildLabel('Max Reply Tokens')}
            labelInLeft
            isNumber
            minNumber={0}
            placeholder={'0 ~ 2048'}
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
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
            label={buildLabel('Top P')}
            labelInLeft
            minNumber={0}
            maxNumber={1}
            placeholder={'0 ~ 1'}
            isNumber
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
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
            label={buildLabel('Frequency Penalty')}
            labelInLeft
            isNumber
            minNumber={-2}
            maxNumber={2}
            placeholder={'-2 ~ 2'}
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
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
            label={buildLabel('Presence Penalty')}
            labelInLeft
            isNumber
            minNumber={-2}
            maxNumber={2}
            placeholder={'-2 ~ 2'}
            errors={formState.errors}
            control={control}
            style={{
              width: '100%',
            }}
          />
        </>
      },
    },
  ]

  return <BaseModelSettings singleFileConfig={singleFileConfig} formConfig={formConfig} />
})

OpenaiModelSettings.displayName = 'OpenaiModelSettings'
