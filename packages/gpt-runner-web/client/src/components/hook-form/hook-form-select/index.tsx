import type { ReactNode } from 'react'
import React, { memo } from 'react'
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseControllerProps,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { VSCodeDropdown } from '@vscode/webview-ui-toolkit/react'
import type { ReadonlyDeep } from '@nicepkg/gpt-runner-shared/common'
import { ErrorText } from '../hook-form-error'
import type { GetComponentProps } from '../../../types/common'
import { Label } from '../hook-form-label'
import { StyledVSCodeDropdown, StyledVSCodeOption } from './hook-form-select.styles'

type SelectProps = GetComponentProps<InstanceType<typeof VSCodeDropdown>>

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

export interface HookFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<SelectProps, 'control' | 'options'> {
  label?: ReactNode
  name: TName
  options: SelectOption[] | ReadonlyDeep<SelectOption[]>
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<SelectProps>) => Partial<SelectProps>
}

function HookFormSelect_<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormSelectProps<TFieldValues>) {
  const { label, name, options, control, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => (
        <>
          <Label>{label}</Label>
          <StyledVSCodeDropdown
            {...{
              ...otherProps,
              ...(typeof filterField === 'function'
                ? filterField(field as any)
                : field),
              onChange: (e: any) => {
                field.onChange(e.target.value)
              },
            }}
          >
            {options.map(option => (
              <StyledVSCodeOption key={option.label} value={option.value}>{option.label}</StyledVSCodeOption>
            ))}
          </StyledVSCodeDropdown>
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

HookFormSelect_.displayName = 'HookFormSelect'

export const HookFormSelect = memo(HookFormSelect_) as typeof HookFormSelect_
