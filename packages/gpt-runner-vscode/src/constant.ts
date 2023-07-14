export const EXT_NAME = 'gpt-runner'
export const EXT_DISPLAY_NAME = 'GPT Runner'

export enum Commands {
  Reload = `${EXT_NAME}.reload`,
  RestartServer = `${EXT_NAME}.restartServer`,
  OpenChat = `${EXT_NAME}.openChat`,
  OpenInBrowser = `${EXT_NAME}.openInBrowser`,
  InsertCodes = `${EXT_NAME}.insertCodes`,
  DiffCodes = `${EXT_NAME}.diffCodes`,
  AskSelection = `${EXT_NAME}.askSelection`,
}

export const URI_SCHEME = 'gpt-runner'

export const GPT_MD_COMPLETION_ITEM_SNIPPET = `\`\`\`json
{
  "title": "common/",
  "model": {
    "type": "openai",
    "modelName": "gpt-3.5-turbo-16k",
    "temperature": 0.7
  }
}
\`\`\`

# System Prompt

input your system prompt here \${1}

# User Prompt

input your user prompt here
`
