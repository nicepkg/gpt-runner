import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import type { FC } from 'react'
import clsx from 'clsx'
import { FlexRowCenter } from '../../styles/global.styles'
import type { GetComponentProps } from '../../types/common'
import { Icon } from '../icon'
import { ButtonWrapper, Text } from './icon-button.styles'

export interface IconButtonProps extends GetComponentProps<InstanceType<typeof VSCodeButton>> {
  text: string
  iconClassName: string
  radius?: string
  showText?: boolean
  hoverShowText?: boolean
  buttonStyle?: React.CSSProperties
}

export const IconButton: FC<IconButtonProps> = (props) => {
  const { text, iconClassName, showText = true, hoverShowText = true, radius = '0.25rem', className, style, buttonStyle, ...otherProps } = props
  return <ButtonWrapper className={clsx('icon-button', className)} style={style} $hoverShowText={hoverShowText}>
    <VSCodeButton
      {...otherProps}
      appearance="secondary"
      ariaLabel={text}
      title={text}
      style={{
        ...buttonStyle,
        borderRadius: radius,
      }}
    >
      <FlexRowCenter style={{
        fontSize: 'var(--type-ramp-base-font-size)',
      }}>
        <Icon className={iconClassName}></Icon>
        {showText && <Text className='icon-button-text'>{text}</Text>}
      </FlexRowCenter>
    </VSCodeButton>
  </ButtonWrapper>
}
