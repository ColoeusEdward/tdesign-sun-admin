import MySkeleton from "components/MySkeleton";
import MyUploader from "components/MyUploader/MyUploader";
import { MacScrollbar } from "mac-scrollbar";
import { ElementRef, forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState, RefAttributes, useEffect } from "react";
import { get_both_tb_post_comment, get_tb_comment, get_tb_post } from "services/nt";
import { Drawer, PageInfo, Pagination } from "tdesign-react";
import { postData, postTData } from 'types/index'
import { ajaxPromiseAll, isLowResolution, toolBarRender } from "utils/util";
import SubPost from "./SubPost";
import { PhotoProvider, PhotoView } from "react-photo-view";

type IPostProp = {
  curItem: postData | undefined
  curBa: { name: string, fid: string }
}
interface PostHandle {
  show: () => void
}
interface CommentInfo {
  type: string
  proId?: string
  useName?: string
  repostid?: string
}
const Post: React.FC<IPostProp & RefAttributes<PostHandle>> = forwardRef(({ curItem, curBa }, ref) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState<postTData[]>()
  const [curComment, setCurComment] = useState<CommentInfo>()
  const curPageRef = useRef(1)
  // const [curPage, setCurPage] = useState(1)
  const [total, setTotal] = useState(1)

  const show = () => {
    setVisible(true)
  }
  const hide = useCallback(() => {
    setVisible(false)
  }, [])
  const getData = () => {
    if (!curItem) return
    setPostList([])
    setCurComment(undefined)
    setLoading(true)
    const tid = curItem.url.split('/')[2]
    get_both_tb_post_comment([{ tid: tid, p: curPageRef.current }, { tid: tid, fid: curBa.fid, p: curPageRef.current }])
      .then(({ list, total }) => {
        total && setTotal(total)
        setPostList(list)
      }).finally(() => {
        setLoading(false)
      })
  }
  const curPageChange = (current: number, pageInfo: PageInfo) => {
    curPageRef.current = current
    getData()
  }
  const submit = useCallback(() => {

  }, [])

  useEffect(() => {
    curPageRef.current = 1
    setTotal(1)
    curItem && getData()
  }, [curItem])

  useImperativeHandle(ref, () => ({
    // compClick
    show
  }))
  const layerClick = (item: any) => {

  }
  const renderRow = () => {
    const renderAuthor = (author: string | any[]) => {
      // console.log("🚀 ~ file: useDetail.tsx ~ line 145 ~ renderAuthor ~ author", author)
      if (typeof author == 'string') {
        return author
      }
      return author.map((e) => {
        let obj: any = {
          text: () => e.val
          , img: () => <img className={'relative top-0.5'} style={{ width: '16px' }} src={e.val} />
        }
        obj['vipText'] = obj.text
        return obj[e.type] && obj[e.type]()
      })
    }
    return postList?.map(e => {
      const renderContent = () => {
        if (typeof e.content == 'string') {
          return e.content
        } else {
          return e.content.map((ce, idx) => {
            let obj: any = {
              text: () => {
                return <div className={'inline-block'}>{ce.val}</div>
              }
              , face: () => <div className={'inline-block relative top-0.5'}><img style={{ width: "30px" }} src={ce.val} /></div>
              , br: () => <div></div>
              , img: () => <div className={'inline-block mr-1'} >
                <PhotoView src={ce.val} >
                  <img src={ce.val} onMouseDown={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation(); }} style={{ width: '50px' }} alt="" />
                </PhotoView>
                {/* </PhotoProvider> */}
                {/* <NImage width="50" src={ce.val} /> */}
              </div>
            }
            // console.log(`obj[ce.type]`,ce,obj[ce.type]);
            return <PhotoProvider className={'select-none'} maskOpacity={0.5} speed={() => 300} toolbarRender={toolBarRender} >
              {obj[ce.type] && obj[ce.type]()}
            </PhotoProvider>

          })
        }
      }

      return (
        <div className={'text-slate-400 hover:bg-zinc-900/70  bg-zinc-800/70 p-3 m-2 mt-3 rounded-xl'}
          style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}
          onMouseDown={() => { layerClick(e) }}>
          <div className={'inline-block w-4/5 text-left'}>
            {/* <div className={'text-base'}>{item.title}</div> */}
            <div className={'text-sm leading-relaxed'}>{renderContent()}</div>
            <SubPost postItem={e} curItem={curItem} />
            {/* {renderReply()} */}
          </div>
          <div className={'inline-block w-1/5 text-right'}>
            <div><div className={'inline-block mr-1'}>{renderAuthor(e.author)}</div> <div className={'text-sm text-slate-500 inline-block'}>{e.floor}</div></div>
            <div className={'text-sm text-slate-500'}>{e.time}</div>

          </div>
        </div>
      )
    })
  }
  const renderBody = () => {

    return (
      <div className={'w-full h-full relative overflow-hidden'}>
        <MySkeleton loading={loading}>
          <MacScrollbar skin={'dark'} className={'w-full h-full'} >
            {renderRow()}
          </MacScrollbar>
        </MySkeleton>
      </div>

    )
  }
  const renderFooter = () => {
    return (
      <Pagination
        totalContent={false}
        total={total}
        current={curPageRef.current}
        defaultPageSize={30}
        onCurrentChange={curPageChange}
        showPageSize={false}
      />
    )
  }

  return (
    <Drawer
      className={'p-0'}
      header={curItem?.title}
      body={renderBody()}
      footer={renderFooter()}
      visible={visible}
      onClose={hide}
      size={isLowResolution() ? '90vw' : '700px'}
    >
    </Drawer>
  )

})

export default memo(Post);