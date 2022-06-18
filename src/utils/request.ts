import axios from 'axios';
import { getMsgOpt } from 'configs/cfg';
import { MessagePlugin } from 'tdesign-react';
import proxy from '../configs/host';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;

const SUCCESS_CODE = 200;
const TIMEOUT = 10000;
let token = localStorage.getItem('meaToken') && JSON.parse(localStorage.getItem('meaToken')!)

const err = (error: any) => {
  return Promise.reject(error)
}

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${token}`
  }
  if (config.method == 'get') {
    config.params = config.data
  }
  // console.log({config});
  return config
}, err)

instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === SUCCESS_CODE) {
        MessagePlugin.success({ content: data.msg, ...getMsgOpt() })
        return data;
      }
      MessagePlugin.error({ content: data.msg, ...getMsgOpt() })
      return Promise.reject(data);
    }
    MessagePlugin.error({ content: response?.data.msg, ...getMsgOpt() })
    return Promise.reject(response?.data);
  },
  (e) => {
    if (e.message.search('401') > -1) {
      MessagePlugin.error({ content: 'token过期, 请重新登录', ...getMsgOpt() })
      localStorage.setItem('meaToken', '')
      location.reload()
    }
    return Promise.reject(e)
  },
);

export default instance;
