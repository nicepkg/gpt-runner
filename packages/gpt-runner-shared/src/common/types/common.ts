export type MaybePromise<T> = T | Promise<T>
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | ((source: string) => boolean) | null | undefined
export type TreeItem<T> = T & { children?: TreeItem<T>[] }
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>
}
export type ValueOf<T> = T[keyof T]

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>
}

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type MaybePartial<T> = Partial<T> | T
