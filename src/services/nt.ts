import { baseRes } from 'types';
import request from 'utils/request';
import { sendRequestG } from 'utils/util';
type loginRes = {
  Bearer: string
  , token: string
}

export const RecordRelease = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release', data);
  return result
};

export const recordFree = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_free', data);
  return result
};
// export const ShowRecord = async (data?: any) => {
//   const result = await request.get<string>('/koa/mv_upload/show_record', data);
//   return result
// };

export const ShowRecordSizeList = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/record_size_list', data);
  let list = result.data.split('\n').slice(0, -1).map(e=>{
    return e.split('\t')
  })
  return list
};

export const LeftStorage = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/left_storage', data);
  return result
};

export const RmFile = async (data?: any) => {
  const result = await request.post<any>('/koa/mv_upload/rmFile', data);
  return result
};

export const loginApi = async (data?: any) => {
  const result = await request.post<loginRes>('/koa/mv_upload/login', data);
  return result.data
};