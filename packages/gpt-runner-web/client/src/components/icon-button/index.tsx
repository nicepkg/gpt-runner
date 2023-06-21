import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { AnimationProps, Target, Tween } from 'framer-motion'
import { motion } from 'framer-motion'
import { useDebounce } from 'react-use'
import type { MaybePromise } from '@nicepkg/gpt-runner-shared/common'
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
  isAnimating?: boolean
  animateDuration?: number
  animateEase?: Tween['ease']
  animateSate?: {
    from: Target
    to: Target
  }
  animatingWhenClick?: boolean
  onClick?: () => MaybePromise<void>
  buttonStyle?: React.CSSProperties
}

export const IconButton: FC<IconButtonProps> = (props) => {
  const {
    text,
    iconClassName,
    showText = true,
    hoverShowText = true,
    radius = '0.25rem',
    className, style,
    buttonStyle,
    isAnimating: initialIsAnimating = false,
    animateDuration = 1000,
    animateEase = 'linear',
    animateSate = {
      from: {
        rotate: 0,
      },
      to: {
        rotate: [0, 360],
      },
    },
    animatingWhenClick = false,
    onClick,
    ...otherProps
  } = props
  const [isAnimating, setIsAnimating] = useState(initialIsAnimating)
  const [debouncedIsAnimating, setDebouncedIsAnimating] = useState(isAnimating)

  useEffect(() => {
    setIsAnimating(initialIsAnimating)
  }, [initialIsAnimating])

  useDebounce(() => {
    setDebouncedIsAnimating(isAnimating)
  }, animateDuration, [isAnimating])

  useEffect(() => {
    isAnimating && setDebouncedIsAnimating(isAnimating)
  }, [isAnimating])

  const handleClick = useCallback(async () => {
    if (animatingWhenClick)
      setIsAnimating(true)

    await onClick?.()

    if (animatingWhenClick)
      setIsAnimating(false)
  }, [animatingWhenClick, onClick])

  const rotateAnimation: AnimationProps = {
    initial: animateSate.from,
    animate: Object.fromEntries(Object.entries(animateSate.to).map(([key, value]) => {
      return [
        key,
        debouncedIsAnimating
          ? value
          : animateSate.from[key as keyof typeof animateSate.from],
      ]
    })),
    transition: {
      duration: animateDuration / 1000,
      ease: animateEase,
      repeat: debouncedIsAnimating ? Infinity : 0,
    },
  }

  return <ButtonWrapper className={clsx('icon-button', className)} style={style} $hoverShowText={hoverShowText}>
    <VSCodeButton
      onClick={handleClick}
      appearance="secondary"
      ariaLabel={text}
      title={text}
      {...otherProps}
      style={{
        ...buttonStyle,
        borderRadius: radius,
      }}
    >
      <FlexRowCenter style={{
        fontSize: 'var(--type-ramp-base-font-size)',
      }}>
        <motion.div style={{ display: 'flex' }} {...rotateAnimation}>
          <Icon className={iconClassName}></Icon>
        </motion.div>

        {showText && <Text className='icon-button-text'>{text}</Text>}
      </FlexRowCenter>
    </VSCodeButton>
  </ButtonWrapper>
}
