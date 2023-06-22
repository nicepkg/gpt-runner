export type MaybePromise<T> = T | Promise<T>
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | ((source: string) => boolean) | null | undefined
export type TreeItem<T> = T & { children?: TreeItem<T>[] }
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>
}
export type ValueOf<T> = T[keyof T]
