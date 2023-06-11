/*
We delay a bit the i18n staging deployment
Because sometimes, prod + i18n-staging call this script at the exact same time
And then both try to dl the translations at the same time, and then we have a
409 error. This delay makes sure prod starts to dl the translations in priority
Used in conjunction with waitForCrowdin.js (which is not enough)
 */

import { ENV, PROJECT_NAME } from './constants'

async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

if (
  ENV.isNetlify
  && ENV.siteName === `${PROJECT_NAME}-i18n-staging`
) {
  console.log(
    `[Crowdin] Delaying the ${PROJECT_NAME}-i18n-staging deployment to avoid 409 errors`,
  )
  await delay(30000)
}
