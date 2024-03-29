import axios from 'axios';
import { getMsgOpt } from 'configs/cfg';
import { MessagePlugin, MessageInfoOptions } from 'tdesign-react';
import proxy from '../configs/host';

const env = import.meta.env.MODE || 'development';
// const API_HOST = proxy[env].API;
let API_HOST = `https://${window.location.host}`;
if(env == 'electron'){
  API_HOST = `https://meamoe.one`
}

const SUCCESS_CODE = 200;
const TIMEOUT = 20000;
let token = localStorage.getItem('meaToken') && JSON.parse(localStorage.getItem('meaToken')!)

const err = (error: any) => {
  return Promise.reject(error)
}
const msgopt = getMsgOpt()
export const instance = axios.create({
  baseURL: env == 'development' ?  '/dev':API_HOST,
  timeout: TIMEOUT,
  withCredentials: false // send cookies when cross-domain requests
});

instance.interceptors.request.use((config) => {
  if (!token) {
    let strtoken = localStorage.getItem('meaToken')
    if (strtoken) {
      token = JSON.parse(strtoken)
    }
  }
  config.headers = Object.assign(config.headers || {}, config.url!.search('koa') > -1 ? {
    Authorization: `Bearer ${token}`
  } : {})

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
      if (!data.code) {  //jsonp 数据处理
        return data
      }
      if (data.code === SUCCESS_CODE) {
        MessagePlugin.success({ content: data.msg, ...getMsgOpt() })
        // console.log("🚀 ~ file: request.ts ~ line 46 ~ { content: data.msg, ...getMsgOpt() }", { content: data.msg, ...getMsgOpt() })
        return data;
      }
      MessagePlugin.error({ content: data.msg, ...getMsgOpt() })
      return Promise.reject(data);
    }
    MessagePlugin.error({ content: response?.data.msg, ...getMsgOpt() })
    return Promise.reject(response?.data);
  },
  (e) => {
    if(e.message.search('timeout') > -1){
      MessagePlugin.error({ content: '请求超时', ...getMsgOpt() })
    }
    if (e.message.search('401') > -1) {
      MessagePlugin.error({ content: 'token过期, 请重新登录', ...getMsgOpt() })
      localStorage.setItem('meaToken', '')
      location.reload()
    }
    return Promise.reject(e)
  },
);

export default instance;
