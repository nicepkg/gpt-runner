declare module 'launch-editor' {
  const launch: (filePath: string, specifiedEditor?: string | ((error: Error) => void), onErrorCallback?: (error: Error) => void) => void
  export default launch
}
