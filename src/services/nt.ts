import { InputValue } from 'tdesign-react';
import { baseRes } from 'types';
import request from 'utils/request';
import { sendRequestG } from 'utils/util';
type loginRes = {
  Bearer: string
  , token: string
}

interface recordData {
  name_list: string[]
  target?: InputValue
}

export const RecordRelease = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release', data);
  return result
};

export const recordFree = async (data?: recordData) => {
  const result = await request.post<any>('/koa/mv_upload/record_free', data);
  return result
};
// export const ShowRecord = async (data?: any) => {
//   const result = await request.get<string>('/koa/mv_upload/show_record', data);
//   return result
// };

export const ShowRecordSizeList = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/record_size_list', data);
  let list = result.data.split('\n').slice(0, -1).map(e => {
    return e.split('\t')
  })
  return list
};

export const LeftStorage = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/left_storage', data);
  let list = result.data.split('\n').slice(0, -1)
  return list
};

export const RmFile = async (data?: any) => {
  const result = await request.post<any>('/koa/mv_upload/rmFile', data);
  return result
};

export const loginApi = async (data?: any) => {
  const result = await request.post<loginRes>('/koa/mv_upload/login', data);
  return result.data
};

export const to_mp4 = async (data?: recordData) => {
  const result = await request.post<any>('/koa/mv_upload/to_mp4', data);
  return result
};

export const upload_temp = async (data: recordData, handleUploadEvent: () => void) => {
  const result = await request.post<any>('/koa/mv_upload/uploadTemp', data, { onUploadProgress: handleUploadEvent });
  return result
};

export const upload_book = async (data: recordData, handleUploadEvent: () => void) => {
  const result = await request.post<any>('/koa/mv_upload/uploadBook', data, { onUploadProgress: handleUploadEvent });
  return result
};

export const deploy = async (data: recordData, handleUploadEvent: () => void) => {
  const result = await request.post<any>('/koa/mv_upload/deploysun', data, { onUploadProgress: handleUploadEvent });
  return result
};

export const reboot_lexue = async (data?: any) => {
  const result = await request.get<string>('/koa/newCen/rebootLexue', { data });
  return result
};

export const git_pull_onedrive_index = async (data?: any) => {
  const result = await request.get<string>('/koa/newCen/gitPullOnedriveInedx', { data });
  return result
};