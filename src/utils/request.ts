import axios from 'axios';
import { MessagePlugin } from 'tdesign-react';
import proxy from '../configs/host';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;

const SUCCESS_CODE = 200;
const TIMEOUT = 10000;

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === SUCCESS_CODE) {
        MessagePlugin.success(data.msg,2000)
        return data;
      }
      MessagePlugin.error(data.msg,2000)
      return Promise.reject(data);
    }
    MessagePlugin.error(response?.data.msg, 2000)
    return Promise.reject(response?.data);
  },
  (e) => Promise.reject(e),
);

export default instance;
