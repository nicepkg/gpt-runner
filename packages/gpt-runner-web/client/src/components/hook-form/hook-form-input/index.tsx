import React, { memo } from 'react'
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseControllerProps,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import { ErrorText } from '../hook-form-error'
import type { GetComponentProps } from '../../../types/common'
import { StyledVSCodeTextField } from './hook-form-input.styles'

type InputProps = GetComponentProps<InstanceType<typeof VSCodeTextField>>

export interface HookFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<InputProps, 'control'> {
  label: string
  name: TName
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<InputProps>) => Partial<InputProps>
}

export function HookFormInput_<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormInputProps<TFieldValues>) {
  const { label, name, control, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => (
        <>
          <StyledVSCodeTextField
            {...{
              ...otherProps,
              ...(typeof filterField === 'function'
                ? filterField(field)
                : field),
            }}
          >{label}</StyledVSCodeTextField>
          {errors?.[name] && (
            <ErrorText>
              {String(errors[name]?.message || 'This field is required')}
            </ErrorText>
          )}
        </>
      )}
      control={control}
      name={name}
      rules={rules}
    />
  )
}

HookFormInput_.displayName = 'HookFormInput'

export const HookFormInput = memo(HookFormInput_) as typeof HookFormInput_
