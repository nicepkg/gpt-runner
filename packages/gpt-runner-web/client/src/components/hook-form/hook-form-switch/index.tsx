import React from 'react'
import type {
  FieldPath,
  FieldValues,
  FormState,
  UseControllerProps,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react'
import { ErrorText } from '../hook-form-error'
import type { GetComponentProps } from '../../../types/common'

type SwitchProps = GetComponentProps<InstanceType<typeof VSCodeCheckbox>>

export interface HookFormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<SwitchProps, 'control'> {
  label: string
  name: TName
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<SwitchProps>) => Partial<SwitchProps>
}

export function HookFormSelect<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormSwitchProps<TFieldValues>) {
  const { label, name, control, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => (
        <>
          <VSCodeCheckbox
            {...{
              ...otherProps,
              ...(typeof filterField === 'function'
                ? filterField(field)
                : field),
              checked: field.value,
              onChange: (e: any) => {
                field.onChange(e.target.checked)
              },
            }}
          >{label}</VSCodeCheckbox>
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
