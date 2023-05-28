import type { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import type { FC } from 'react'
import { FlexRowCenter } from '../../styles/global.styles'
import type { GetComponentProps } from '../../types/common'
import { Icon } from '../icon'
import { StyledVSCodeButton, Text } from './icon-button.styles'

export interface IconButtonProps extends GetComponentProps<InstanceType<typeof VSCodeButton>> {
  text: string
  iconClassName: string
  radius?: string
  showText?: boolean
  hoverShowText?: boolean
}

export const IconButton: FC<IconButtonProps> = (props) => {
  const { text, iconClassName, showText = true, hoverShowText = true, radius = '0.25rem', ...otherProps } = props
  return <StyledVSCodeButton
    {...otherProps}
    $hoverShowText={hoverShowText}
    appearance="secondary"
    ariaLabel={text}
    title={text}
    style={{
      ...otherProps.style,
      borderRadius: radius,
    }}
  >
    <FlexRowCenter style={{
      fontSize: 'var(--type-ramp-base-font-size)',
    }}>
      <Icon className={iconClassName}></Icon>
      {showText && <Text className='icon-button-text'>{text}</Text>}
    </FlexRowCenter>
  </StyledVSCodeButton>
}
