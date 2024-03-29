import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

export interface Props {
  url: string
  handle: string
  name: string
  content: ReactNode
  avatar: string
  date: string
}

export default function Tweet({
  url,
  handle,
  name,
  content,
  avatar,
  date,
}: Props): JSX.Element {
  return (
    <div className={clsx('card', styles.tweet)}>
      <div className="card__header">
        <div className="avatar">
          <img
            alt={name}
            className="avatar__photo"
            src={avatar}
            width="48"
            height="48"
            loading="lazy"
          />
          <div className={clsx('avatar__intro', styles.tweetMeta)}>
            <strong className="avatar__name">{name}</strong>
            <span>@{handle}</span>
          </div>
        </div>
      </div>

      <div className={clsx('card__body', styles.tweet)}>{content}</div>

      <div className="card__footer">
        <a className={clsx(styles.tweetMeta, styles.tweetDate)} href={url}>
          {date}
        </a>
      </div>
    </div>
  )
}
