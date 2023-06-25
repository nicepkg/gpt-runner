import React, { memo } from 'react'
import { Controller } from 'react-hook-form'
import styled from 'styled-components'

const SliderContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
`

const SliderTrack = styled.div`
  height: 100%;
  background-color: #2196f3;
  border-radius: 5px;
`

const SliderThumb = styled.div`
  width: 20px;
  height: 20px;
  background-color: #2196f3;
  border-radius: 50%;
  position: relative;
  top: -5px;
  cursor: pointer;
`

interface HookFormSliderProps {
  name: string
  control: any
  defaultValue?: number
  min?: number
  max?: number
  step?: number
}

export function HookFormSlider_({
  name,
  control,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
}: HookFormSliderProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <SliderContainer>
          <SliderTrack style={{ width: `${((field.value - min) / (max - min)) * 100}%` }} />
          <SliderThumb
            {...field}
            onMouseDown={(e: any) => e.preventDefault()}
            onTouchStart={(e: any) => e.preventDefault()}
            style={{ left: `${((field.value - min) / (max - min)) * 100}%` }}
          />
        </SliderContainer>
      )}
      rules={{ min, max }}
    />
  )
}

HookFormSlider_.displayName = 'HookFormSlider'

export const HookFormSlider = memo(HookFormSlider_) as typeof HookFormSlider_
