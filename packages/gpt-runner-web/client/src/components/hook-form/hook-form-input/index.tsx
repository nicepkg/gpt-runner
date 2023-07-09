import type { ReactNode } from 'react'
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
import { FlexColumn, FlexRow } from '../../../styles/global.styles'
import { StyledVSCodeTextField } from './hook-form-input.styles'

function allowOnlyNumber(value: string, max?: number, min?: number): number {
  const sanitizedValue = value.replace(/[^\d.-]/g, '').replace(/(?!^)-/g, '').replace(/(\..*)\./g, '$1')
  const parseNum = Number(sanitizedValue)

  if (max !== undefined && parseNum > max)
    return max

  if (min !== undefined && parseNum < min)
    return min

  return parseNum
}

type InputProps = GetComponentProps<InstanceType<typeof VSCodeTextField>>

export interface HookFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<UseControllerProps<TFieldValues>, 'rules'>, Omit<InputProps, 'control'> {
  label?: ReactNode
  labelInLeft?: boolean
  isNumber?: boolean
  maxNumber?: number
  minNumber?: number
  name: TName
  errors: FormState<TFieldValues>['errors']
  control: UseControllerProps<TFieldValues>['control']
  filterField?: (field: Partial<InputProps>) => Partial<InputProps>
}

function HookFormInput_<
  TFieldValues extends FieldValues = FieldValues,
>(props: HookFormInputProps<TFieldValues>) {
  const { label, labelInLeft, name, control, isNumber, maxNumber, minNumber, rules, errors, filterField, ...otherProps }
    = props

  return (
    <Controller
      render={({ field }) => {
        const filteredField: any = typeof filterField === 'function' ? filterField(field as any) : field

        const finalField = {
          ...filteredField,
          onChange: (e: any) => {
            e.target.value = isNumber ? allowOnlyNumber(e.target.value, maxNumber, minNumber) : e.target.value
            return filteredField.onChange(e)
          },
        } as typeof field

        return (<FlexColumn style={{ flex: 1 }}>
          <FlexRow>
            {labelInLeft && label}
            <StyledVSCodeTextField
              {...{
                ...otherProps,
                ...finalField,
              }}
            >{labelInLeft ? '' : label}</StyledVSCodeTextField>
          </FlexRow>
          {errors?.[name] && (
            <ErrorText>
              {String(errors[name]?.message || 'This field is required')}
            </ErrorText>
          )}
        </FlexColumn>)
      }}
      control={control}
      name={name}
      rules={rules}
    />
  )
}

HookFormInput_.displayName = 'HookFormInput'

export const HookFormInput = memo(HookFormInput_) as typeof HookFormInput_
