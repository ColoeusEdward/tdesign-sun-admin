import request from 'utils/request';
import { sendRequestG } from 'utils/util';


export const RecordRelease = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release', { data: data });
  return result
};

// export const ShowRecord = async (data?: any) => {
//   const result = await request.get<string>('/koa/mv_upload/show_record', { data: data });
//   return result
// };

export const ShowRecordSizeList = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/record_size_list', { data: data });
  return result
};

export const LeftStorage = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/left_storage', { data: data });
  return result
};

export const RmFile = async (data?: any) => {
  const result = await request.post<any>('/koa/mv_upload/rmFile', { data: data });
  return result
};