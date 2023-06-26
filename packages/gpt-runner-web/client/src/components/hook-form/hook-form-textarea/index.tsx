import React, { memo } from 'react'
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseControllerProps,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react'
import { ErrorText } from '../hook-form-error'
import type { GetComponentProps } from '../../../types/common'
import { StyledVSCodeTextArea } from './hook-form-textarea.styles'

type TextareaProps = GetComponentProps<InstanceType<typeof VSCodeTextArea>>

export interface HookFormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<TextareaProps, 'control'> {
  label: string
  name: TName
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<TextareaProps>) => Partial<TextareaProps>
}

export function HookFormTextarea_<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormTextareaProps<TFieldValues>) {
  const { label, name, control, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => (
        <>
          <StyledVSCodeTextArea
            {...{
              ...otherProps,
              ...(typeof filterField === 'function'
                ? filterField(field as any)
                : field),
            }}
          >{label}</StyledVSCodeTextArea>
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

HookFormTextarea_.displayName = 'HookFormTextarea'

export const HookFormTextarea = memo(HookFormTextarea_) as typeof HookFormTextarea_
