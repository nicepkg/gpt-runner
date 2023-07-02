import type { FC } from 'react'
import { memo, useState } from 'react'
import type { PopoverMenuProps } from '../popover-menu'
import { PopoverMenu } from '../popover-menu'
import { IconButton } from '../icon-button'
import { SelectOptionItem, SelectOptionList } from './select-option.styles'

export interface ISelectOption<T extends string = string> {
  label: string
  value: T
}

export interface SelectOptionProps<T extends string = string> {
  popoverMenuProps?: PopoverMenuProps
  options: ISelectOption<T>[]
  value?: T
  onChange?: (value: T, option: ISelectOption<T>) => void
}

export const SelectOption: FC<SelectOptionProps> = memo((props) => {
  const { popoverMenuProps, options, value, onChange } = props
  const [isOpen, setIsOpen] = useState(false)

  return <PopoverMenu
    isPopoverOpen={isOpen}
    xPosition='center'
    yPosition='bottom'
    clickMode
    zIndex={999}
    menuMaskStyle={{
      marginLeft: '1rem',
      marginRight: '1rem',
      paddingTop: '0.5rem',
    }}
    menuStyle={{
      height: 'auto',
    }}
    childrenStyle={{
      height: '100%',
    }}
    onPopoverDisplayChange={(isPopoverOpen) => {
      setIsOpen(isPopoverOpen)
    }}
    buildChildrenSlot={({ isOpen }) => {
      return <IconButton
        text={'Select'}
        iconClassName={isOpen ? 'codicon-chevron-up' : 'codicon-chevron-down'}
        showText={false}
        style={{
          paddingLeft: '0.5rem',
          height: '100%',
        }}
      ></IconButton>
    }}
    buildMenuSlot={() => {
      return <SelectOptionList>
        {options.map((option) => {
          return <SelectOptionItem
            key={option.value}
            data-selected={option.value === value}
            onClick={(e: any) => {
              onChange?.(option.value, option)
              setIsOpen(false)
              e.stopPropagation()
              return false
            }}>{option.label}</SelectOptionItem>
        })}
      </SelectOptionList>
    }}
    {...popoverMenuProps}
  />
})

SelectOption.displayName = 'SelectOption'
