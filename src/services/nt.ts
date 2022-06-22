import { InputValue } from 'tdesign-react';
import { baseRes } from 'types';
import request from 'utils/request';
import { sendRequestG } from 'utils/util';
import jsonpAdapter from 'axios-jsonp'
import * as htmlparser2 from "htmlparser2";
import { postData } from 'types/index'

type loginRes = {
  Bearer: string
  , token: string
}


interface recordData {
  name_list: string[]
  target?: InputValue
}

export const RecordRelease = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release', { data });
  return result
};

export const mp4_release = async (data?: any) => {
  const result = await request.get<any>('/koa/mv_upload/record_release_mp4', { data });
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

export const roll_back_sun = async (data?: any) => {
  const result = await request.get<string>('/koa/mv_upload/rollBackSun', { data });
  return result
};

export const update_ecc = async (data?: any) => {
  const result = await request.get<string>('/koa/newCen/updateEcc', { data });
  return result
};

export const backup_img = async (data?: { imgurl: string }) => {
  const result = await request.post<any>('/koa/newCen/free/backupImg', data);
  return result
};

export const get_weather = async () => {
  const result = await request({
    url: 'https://tianqi.2345.com/api/getWeatherInfo.php'
    , adapter: jsonpAdapter
  })
  return result
}

export const get_v8 = async (data?: any) => {
  const result = await request.get<string>('/koa/newCen/free/getV8', { data });
  return result
};

export const get_v8_comment = async (data: { tid: string, p: number }) => {
  const result = await request.get<string>(`/koa/newCen/free/getV8Comment/${data.tid}/${data.p}`);
  return result
};
export const get_tb = async (data?: any) => {
  const buildAuthor = (ele: any) => {
    // console.log("🚀 ~ file: indexTSX.tsx ~ line 66 ~ buildAuthor ~ ele", ele)
    let isVip = false
    let item = ele.children[1]
    if (item.attribs.class == 'pre_icon_wrap pre_icon_wrap_theme1 frs_bright_preicon') {
      isVip = true
      item = item.next
    }
    let list = item.children[0].children.map((e) => {
      let type = ''
      e.type == 'text' && (type = 'text')
      e.name == 'img' && (type = 'img')
      return {
        type: type
        , val: type == 'text' ? e.data : e.attribs.src
      }
    })
    isVip && list.unshift({ type: 'text', val: '👑' })
    return list
  }
  const parseData = (str: string) => {
    const dom = htmlparser2.parseDocument(str)
    let list: postData[] = (dom.children[0] as any).children.filter((e:any) => {
      return e.type != 'text' && e['name'] != 'div' && e['attribs']['class'] != 'thread_top_list_folder'
    }).map((le: any) => {
      const item = le.children[1]
      const left = item.children[1]
      const right = item.children[3]
      // console.log(`le`, { left, right });
      const imgEleList = right.children[3].children[1].children[3]?.children[5]?.children[1].children[1].children
      let data: postData = {
        title: right.children[1]?.children[1]?.children[1]?.children[0]?.data
        , url: right.children[1]?.children[1]?.children[1]?.attribs.href
        , info: right.children[3]?.children[1]?.children[1]?.children[0]?.data || ' '
        , replyNum: left.children[1].children[0].data
        // , author: right.children[1].children[2].children[1].attribs.title.split(': ')[1]
        , author: buildAuthor(right.children[1].children[2].children[1])
        , lastTime: right.children[3].children[3].children[3].children[0].data
        , imgList: imgEleList ? imgEleList.map(e => e.children[0].children[0].attribs.bpic) : []
      }
      // console.log("🚀 ~ file: indexTSX.tsx ~ line 37 ~ parseData ~ data", data)
      return data
    })
    return list
  }
  const result = await request.get<string>(`/koa/newCen/free/getTB`, { data });
  const str = result.data
  if (str.length == 0) return []
  let startIdx = str.search(`<ul id=\"thread_list\"`)
  let endIdx = str.search(`</ul>\n\n<div class=\"thread`)
  let newStr = str.slice(startIdx, endIdx + 6)
  return parseData(newStr)
};

export const get_tb_comment = async (data?: any) => {
  const result = await request.get<string>(`/koa/newCen/free/getTBComment`, { data });
  return result
};

export const get_page_tb_comment = async (data?: any) => {
  const result = await request.get<string>(`/koa/newCen/free/getPageTBComment`, { data });
  return result
};

export const get_tb_post = async (data?: any) => {
  const result = await request.get<string>(`/koa/newCen/free/getTBPost`, { data });
  return result
};

export const reply_tb = async (data?: any) => {
  const result = await request.post<string>(`/koa/newCen/free/replyTB`, { data });
  return result
};

export const reply_comment = async (data?: any) => {
  const result = await request.post<string>(`/koa/newCen/free/replyComment`, { data });
  return result
};
