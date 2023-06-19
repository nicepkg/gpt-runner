import React from 'react'
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseControllerProps,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react'
import { ErrorText } from '../hook-form-error'
import type { GetComponentProps } from '../../../types/common'

type SelectProps = GetComponentProps<InstanceType<typeof VSCodeDropdown>>

export interface SelectOption {
  label: string
  value: string
}

export interface HookFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<SelectProps, 'control' | 'options'> {
  label: string
  name: TName
  options: SelectOption[]
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<SelectProps>) => Partial<SelectProps>
}

export function HookFormSelect<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormSelectProps<TFieldValues>) {
  const { label, name, options, control, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => (
        <>
          <div>{label}</div>
          <VSCodeDropdown
            {...{
              ...otherProps,
              ...(typeof filterField === 'function'
                ? filterField(field)
                : field),
              onChange: (e: any) => {
                field.onChange(e.target.value)
              },
            }}
          >
            {options.map(option => (
              <VSCodeOption value={option.value}>{option.label}</VSCodeOption>
            ))}
          </VSCodeDropdown>
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
