import request from 'utils/request';
import { sendRequestG } from 'utils/util';


export const RecordRelease = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release', { data: data });
  return result
};
