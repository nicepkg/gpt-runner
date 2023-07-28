import { ChatModelType } from '../types'

export const MIN_NODE_VERSION = '16.15.0'
export const SECRET_KEY_PLACEHOLDER = '********'
export const STREAM_DONE_FLAG = '[DONE]'
export const GPT_RUNNER_OFFICIAL_FOLDER = '.gpt-runner'

export const DEFAULT_API_BASE_PATH: {
  [Key in ChatModelType]: string
} = {
  [ChatModelType.Anthropic]: 'https://api.anthropic.com',
  [ChatModelType.HuggingFace]: 'https://api-inference.huggingface.co',
  [ChatModelType.Openai]: 'https://api.openai.com/v1',
}

export const DEFAULT_MODEL_NAMES_FOR_CHOOSE: {
  [Key in ChatModelType]: string[]
} = {
  [ChatModelType.Anthropic]: [
    'claude-2',
    'claude-instant-1',
  ],
  [ChatModelType.HuggingFace]: [],
  [ChatModelType.Openai]: [
    'gpt-3.5-turbo-16k',
    'gpt-4',
    'gpt-4-32k',
    'gpt-3.5-turbo',
  ],
}

export const DEFAULT_EXCLUDE_FILES = [
  '**/node_modules',
  '**/.git',
  '**/__pycache__',
  '**/.Python',
  '**/.DS_Store',
  '**/.cache',
  '**/.next',
  '**/.nuxt',
  '**/.out',
  '**/dist',
  '**/.serverless',
  '**/.parcel-cache',
]

export const DEFAULT_EXCLUDE_FILE_EXTS = [
  '.jpg',
  '.png',
  '.gif',
  '.jpeg',
  '.svg',
  '.mp4',
  '.mp3',
  '.wav',
  '.flac',
  '.ogg',
  '.webm',
  '.ico',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.zip',
  '.rar',
  '.7z',
  '.tar',
  '.gz',
  '.tgz',
  '.bz2',
  '.xz',
  '.exe',
  '.dmg',
  '.pkg',
  '.deb',
  '.rpm',
  '.msi',
  '.apk',
  '.ipa',
  '.iso',
  '.img',
  '.bin',
  '.dll',
  '.so',
  '.dylib',
  '.a',
  '.lib',
  '.o',
  '.obj',
  '.class',
  '.jar',
  '.war',
  '.ear',
  '.swf',
  '.fla',
  '.as',
  '.as3',
  '.mxml',
  '.swc',
  '.swd',
  '.swz',
  '.swt',
  '.air',
  '.ane',
  '.ttf',
  '.woff',
  '.woff2',
  '.eot',
  '.otf',
  '.psd',
  '.ai',
  '.sketch',
  '.fig',
  '.xd',
  '.blend',
  '.fbx',
  '.obj',
  '.mtl',
  '.stl',
  '.3ds',
  '.dae',
  '.max',
  '.ma',
  '.mb',
  '.lwo',
  '.lws',
  '.lxo',
  '.c4d',

  // data
  '.csv',
  '.tsv',

  // ai
  '.pth',
  '.pt',
  '.h5',
  '.hdf5',
  '.ckpt',
  '.ckpt.index',
]
