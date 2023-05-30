import type { ZodSchema } from 'zod'

export function verifyZod<T>(schema: ZodSchema<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    const errorTextArr: string[] = []
    result.error.issues.forEach((issue) => {
      const { path: fields } = issue
      return fields.forEach((field) => {
        const prefix = errorTextArr.length === 0 ? 'Error: ' : '.\n'
        const errorText = `${prefix}${field} field is ${issue.message?.toLowerCase()}`
        errorTextArr.push(errorText)
      })
    })

    // eslint-disable-next-line unicorn/error-message
    throw new Error(errorTextArr.join('\n'))
  }

  return result.data
}
