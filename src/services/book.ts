import { InputValue } from 'tdesign-react';
import { baseRes } from 'types';
import request from 'utils/request';
import { ajaxPromiseAll, sendRequestG } from 'utils/util';
import { postData, postTData } from 'types/index'
import { localBook } from 'jtStore/book';


export const get_curbook = async (data: { name: string }) => {
  const result = await request.get<localBook>('/koa/newCen/free/getCurbook', { data });
  return result.data
};

export const get_exist_book = async (data?:any) => {
  const result = await request.get<string[]>('/koa/newCen/getExistBook', { data });
  return result.data
};