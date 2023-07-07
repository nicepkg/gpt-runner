import { type BaseResponse, type CreateFilePathReqParams, type CreateFilePathResData, type DeleteFilePathReqParams, type DeleteFilePathResData, type GetFileInfoReqParams, type GetFileInfoResData, type OpenEditorReqParams, type OpenEditorResData, type RenameFilePathReqParams, type RenameFilePathResData, type SaveFileContentReqParams, type SaveFileContentResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function openEditor(params: OpenEditorReqParams): Promise<BaseResponse<OpenEditorResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/open-editor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rootPath: getGlobalConfig().rootPath,
      ...params,
    }),
  })
}

export async function createFilePath(params: CreateFilePathReqParams): Promise<BaseResponse<CreateFilePathResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/create-file-path`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

export async function renameFilePath(params: RenameFilePathReqParams): Promise<BaseResponse<RenameFilePathResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/rename-file-path`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

export async function deleteFilePath(params: DeleteFilePathReqParams): Promise<BaseResponse<DeleteFilePathResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/delete-file-path`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

export async function getFileInfo(params: GetFileInfoReqParams): Promise<BaseResponse<GetFileInfoResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/get-file-info?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function saveFileContent(params: SaveFileContentReqParams): Promise<BaseResponse<SaveFileContentResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/save-file-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}
