import type { ChangeLogConfig, ReleaseConfig } from '@nicepkg/gpt-runner-shared/common'

const changeLogs: ChangeLogConfig[] = [
  {
    releaseDate: '2023-07-24 23:40:59',
    version: '1.2.0',
    changes: 'fix some bug',
  },
]

export const releaseConfig: ReleaseConfig = {
  createAt: '2023-07-24 23:41:04',
  changeLogs,
}
