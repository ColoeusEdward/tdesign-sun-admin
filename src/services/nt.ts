import { InputValue } from 'tdesign-react';
import { baseRes } from 'types';
import request from 'utils/request';
import { ajaxPromiseAll, sendRequestG } from 'utils/util';
import jsonpAdapter from 'axios-jsonp'
import * as htmlparser2 from "htmlparser2";
import { postData, postTData } from 'types/index'

type loginRes = {
  Bearer: string
  , token: string
}
interface recordData {
  name_list: string[]
  target?: InputValue
}
type playLog = {
  id:number,
  ts?:number,
  at:number
}
export type wechatnewData = {
  acf:object,
  id:number,
  title:{
    rendered:string
  }
}

const judgeFn = (name: string) => {
  return (e: any) => e.attribs && (e.attribs.class == name || e.attribs.id == name)
}
const judegFnNon = (name: string) => {
  return (e: any) => {
    return !judgeFn(name)(e)
  }
}
const judgeFnList = (nameList: string[], isNon: boolean) => {
  return (item: any) => {
    return nameList.every(name => {
      return isNon ? judegFnNon(name)(item) : judgeFn(name)(item)
    })
  }
}
const judgeFn2 = (name: string) => {
  return (e: any) => e.name && e.name == name
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
  const result = await request.post<any>('/koa/mv_upload/uploadTemp', data, { onUploadProgress: handleUploadEvent, timeout: 200000 });
  return result
};

export const upload_book = async (data: recordData, handleUploadEvent: () => void) => {
  const result = await request.post<any>('/koa/mv_upload/uploadBook', data, { onUploadProgress: handleUploadEvent, timeout: 200000 });
  return result
};

export const deploy = async (data: recordData, handleUploadEvent: () => void) => {
  const result = await request.post<any>('/koa/mv_upload/deploysun', data, { onUploadProgress: handleUploadEvent, timeout: 200000 });
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
    let list = item.children[0].children.map((e: any) => {
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
    let list: postData[] = (dom.children[0] as any).children.filter((e: any) => {
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
        , imgList: imgEleList ? imgEleList.map((e: any) => e.children[0].children[0].attribs.bpic) : []
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
  const result = await request.get<any>(`/koa/newCen/free/getTBComment`, { data });
  return result.data
};

export const get_page_tb_comment = async (data?: any) => {
  const buildNewReList = (str: string) => {
    const dom = htmlparser2.parseDocument(str)
    console.log("🚀 ~ file: useDetail.tsx ~ line 218 ~ buildNewReList ~ dom", dom)
    // const conDiv = dom.children.splice(0, dom.children.length - 2)
    // console.log(`dom.children.splice(0, dom.children.length - 2)`,dom.children.slice(0, dom.children.length - 2));
    let list: postTData['reList'] = dom.children.filter(judegFnNon('lzl_li_pager j_lzl_l_p lzl_li_pager_s')).map((e: any) => {
      let d: any[] = []
      // console.log("🚀 ~ file: useDetail.tsx ~ line 237 ~ letlist:typeofitem.reList=dom.children.slice ~ item", item)
      let proId = JSON.parse(e['attribs']['data-field']).portrait
      d.push({ type: 'text', val: e.children[3].children[0].children[0].data + `: `, proId })
      e.children[3].children[2].children.forEach((e: any) => {
        e.type == 'text' && d.push({ type: 'text', val: e.data, proId: proId })
        e.attribs && e.attribs.class == 'BDE_Smiley' && d.push({ type: 'img', val: e.attribs.src, proId: proId })
      })
      // console.log("🚀 ~ file: useDetail.tsx ~ line 245 ~ letlist:typeofitem.reList=dom.children.splice ~ d", d)
      return d
    })
    return list
  }
  const result = await request.get<string>(`/koa/newCen/free/getPageTBComment`, { data });
  const str = result.data
  // const reList =  
  return buildNewReList(str)
};

export const get_tb_post = async (data?: any) => {
  const result = await request.get<string>(`/koa/newCen/free/getTBPost`, { data });
  return result.data
};

export const reply_tb = async (data?: any) => {
  const result = await request.post<any>(`/koa/newCen/free/replyTB`, data);
  return result.data
};

export const reply_comment = async (data: any) => {
  const result = await request.post<any>(`/koa/newCen/free/replyComment`, data);
  return result.data
};

export const get_both_tb_post_comment = async (data: any[]) => {
  const buildAuthor = (ele: any) => {
    // console.log("🚀 ~ file: useDetail.tsx ~ line 56 ~ buildAuthor ~ ele", ele)
    // let res = ''
    let isVip = false
    if (ele.children.length > 1) {
      let list: any[] = []
      ele.children.filter((e: any) => e.type != 'text').forEach((ee: any) => {
        ee.attribs && ee.attribs.class == 'pre_icon_wrap pre_icon_wrap_theme1 d_name_icon' && (isVip = true)
        if (ee.name == 'a') {
          ee.children.forEach((e: any) => {
            // console.log("🚀 ~ file: useDetail.tsx ~ line 79 ~ ele.children.filter ~ e", e)
            let type = ''
            e.type == 'text' && (type = 'text')
            e.name == 'a' && (type = 'atext')
            e.name == 'img' && e.attribs.class == 'nicknameEmoji' && (type = 'img')

            let d = {
              type: type
              , val: ''
            }
            type == 'text' && (d.val = e.data)
            type == 'atext' && (d.val = e.children[0].data)
            type == 'img' && (d.val = e.attribs.src)
            list.push(d)
          })
        }
      })
      isVip && list.unshift({ type: 'text', val: '👑' })
      return list
    }
    return ele.children[0].children[0].data
  }
  const buildContent = (ele: any): any => {
    // console.log("🚀 ~ file: useDetail.tsx ~ line 33 ~ buildContent ~ ele", ele)
    let res = ''
    if (ele.children.length == 1 && ele.children[0].type == 'text') {
      return ele.children[0].data
    }
    if (ele.children.length > 1 && ele.children[1].attribs && ele.children[1].attribs.class == 'post_bubble_top') {
      // console.log(`有泡泡`,ele.children[2].children[0]);
      return buildContent(ele.children[2].children[0])
      console.log("🚀 ~ file: useDetail.tsx ~ line 51 ~ == ~ buildContent ~ ele.children[1]", ele.children[1])
    }
    res = ele.children.map((e: any) => {
      let type = ''
      let d = {}
      e.type == 'text' && (d = { type: 'text', val: e.data })
      e.name == 'img' && (d = { type: 'face', val: e.attribs.src })
      e.name == 'img' && e.attribs.class.search('BDE_Image') != -1 && (d = { type: 'img', val: e.attribs.src })
      e.name == 'br' && (d = { type: 'br', val: '' })
      e.name == 'a' && (d = { type: 'text', val: e.children[0].data })
      // console.log("🚀 ~ file: useDetail.tsx ~ line 49 ~ res=ele.children.filter ~ e", e.type == 'text',e)
      // if(type=='')
      //   console.log(`eee`,e);
      // let d = {
      //   type: type
      //   , val: type == 'text' ? e.data : type == 'br' ? '' : e.attribs.src
      // }
      return d
    })
    return res
  }
  const buildReList = (cdata: any, id: string) => {
    let strList = cdata.comment_list[id]?.comment_info.map((e: any) => {
      return { str: `${e.show_nickname}: ${e.content}`, info: { userId: e.user_id, repostid: e.comment_id } }
    })
    // console.log("🚀 ~ file: useDetail.tsx ~ line 119 ~ buildReList ~ strList", strList)
    let resList = []

    strList && (resList = strList.map((e: any) => {
      let dom = htmlparser2.parseDocument(e.str)
      // console.log("🚀 ~ file: useDetail.tsx ~ line 120 ~ buildReList ~ dom", dom)
      let list = dom.children.map((ee: any) => {
        // console.log("🚀 ~ file: useDetail.tsx ~ line 126 ~ list ~ ee", ee)
        let res: any = {}
        ee.type == 'text' && (res = { type: 'text', val: ee.data })
        ee['name'] == 'a' && (res = { type: 'text', val: `【` + ee['children'][0].data + `】` })
        ee['name'] == 'img' && (res = { type: 'img', val: ee.attribs.src })
        res['proId'] = cdata.user_list[e.info.userId].portrait
        res['quoteId'] = id
        res['repostid'] = e.info.repostid
        return res
      })

      return list
    }))
    // console.log("🚀 ~ file: useDetail.tsx ~ line 121 ~ buildReList ~ resList", resList)
    return resList
  }
  const parseData = (pstr: string, cdata: any) => {
    pstr = pstr.slice(pstr.search(`<div class="p_postlist" id="j_p_postlist">`), pstr.search(`</div><div class="right_section right_bright">`))

    const dom = htmlparser2.parseDocument(pstr)
    let list: postTData[] = (dom.children[0] as any).children.filter((e: any) => {
      return e.type != 'text' && e['name'] == 'div' && e['attribs']['class'] == 'l_post l_post_bright j_l_post clearfix  '
    }).map((le: any) => {
      // console.log("🚀 ~ file: useDetail.tsx ~ line 41 ~ parseData ~ le", le)
      const core_reply = le.children[2].children.find(judgeFn('core_reply j_lzl_wrapper'))
      const tailInfo = core_reply.children[0].children.find(judgeFn('post-tail-wrap')).children.filter(judgeFnList(['p_reply p_reply_first', 'j_lzl_r p_reply'], true))
      let pauth = le.children[1].children.find(judgeFn('p_author'))
      // console.log("🚀 ~ file: useDetail.tsx ~ line 101 ~ parseData ~ pauth", le.children[1])

      let cont = le.children[2].children[1].children.find(judgeFn2('cc'))
      // console.log("🚀 ~ file: useDetail.tsx ~ line 103 ~ parseData ~ cont", cont)
      const id = cont.children[2].attribs.id.split('_')[2]
      const pgC = cdata.comment_list[id] ? Math.ceil(cdata.comment_list[id]['comment_num'] / cdata.comment_list[id]['comment_list_num']) : 1
      let data: postTData = {
        content: buildContent(cont.children[2])
        , id: id
        , author: buildAuthor(pauth.children[5])
        , floor: tailInfo.slice(-2)[0].children[0].data
        , time: tailInfo.slice(-1)[0].children[0].data
        , reList: buildReList(cdata, id)
        , reData: cdata.comment_list[id]
        , rePn: 1
        , reLoading: false
        , pageCount: pgC
      }
      // console.log("🚀 ~ file: indexTSX.tsx ~ line 37 ~ parseData ~ data", data)
      return data
    })
    console.log("🚀 ~ file: useDetail.tsx ~ line 72 ~ parseData ~ list", list)
    console.log(`cdata`, cdata);
    return list
  }
  const getPageCount = (str: string) => {
    let i = str.search('尾页')
    let idx = str[i - 3]
    let idx2 = str[i - 4]
    // console.log("🚀 ~ file: useDetail.tsx ~ line 34 ~ getPageCount ~ idx2",idx, idx2)
    if (!idx2)
      return
    if (idx2 == '=') {
      return Number(idx)
    } else {
      return Number(idx2 + idx)
    }
  }
  const [str, { data: cdata }] = await ajaxPromiseAll([get_tb_post(data[0]), get_tb_comment(data[1])])
  const pageCount = getPageCount(str)
  const total = pageCount && pageCount * 30
  const list = parseData(str, cdata)
  return {
    list, total
  }
}


export const get_exist_book = async (data?: any) => {
  const result = await request.get<string[]>('/koa/newCen/getExistBook', { data });
  return result.data
};

export const get_account_list = async (data?: any) => {
  const result = await request.get<string>('/koa/newCen/getAccountList', { data });
  return result.data
};

export const save_account_list = async (data: any) => {
  const result = await request.post<any>('/koa/newCen/saveAccountList', data);
  return result
};

export const delete_accout = async (data: any) => {
  const result = await request.post<any>('/koa/newCen/deleteAccout', data);
  return result
};

export const upload_tb_img = async (data: { fid: string, url: string }) => {
  const result = await request.post<any>('/koa/newCen/free/uploadTbImg', data);
  return result.data
};

export const sync_video_to_you = async (data: { url: string, token?: string }) => {
  const result = await request.post<any>('/koa/newCen/syncVideoToYou', data);
  return result.data
};

export const edit_accountList = async (data: { acc: string, psw: string, i: number }) => {
  const result = await request.post<any>('/koa/newCen/editAccountList', data);
  return result.data
};

export const post_sa_image = async (data: {url: string }) => {
  const result = await request.post<string>('/koa/newCen/free/sanoSearch', data,
  );
  return result.data
}

export const get_gradio= async () => {
  const result = await request.get<{label:string,Id:string}[]>('/koa/newCen/getGRadio'
  );
  return result.data
}
export const get_gradio_info = async (id:string) => {
  const result = await request.get<any>(`/proxy/gradio/id=${id}?include=media%2Cdjs%2Cmedia.timelines`
  );
  return result
}
export const save_radio_playlog = async (info:playLog) => {
  const result = await request.post<any>(`/koa/newCen/saveRadioPlayLog`,{info}
  );
  return result.data
}
export const get_radio_playlog = async (id:number) => {
  const result = await request.get<playLog>('/koa/newCen/getRadioPlayLog',{data:{id}}
  );
  return result.data
}

export const get_wechat_new = async  (num:number) => {
  const result = await request.get<wechatnewData[]>(`/proxy/wechatnew/ps=${num}`,{}
  );
  return result as unknown as wechatnewData[]
}



