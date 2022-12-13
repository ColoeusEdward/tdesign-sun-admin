import MySkeleton from "components/MySkeleton";
import { MacScrollbar } from "mac-scrollbar";
import React, { ElementRef, forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState, RefAttributes, useEffect, useMemo, EventHandler } from "react";
import { get_both_tb_post_comment, get_tb_comment, get_tb_post } from "services/nt";
import { Button, Drawer, PageInfo, Pagination } from "tdesign-react";
import { postData, postTData } from 'types/index'
import { ajaxPromiseAll, copyToPaste, isLowResolution, menuClassName, sleep, toolBarRender, useToolBarRender } from "utils/util";
import SubPost from "./SubPost";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Replay, { ReplayHandle } from "./Replay";

import { useAtom, useAtomValue } from "jotai";
import { curCommRefAtomRead, curMenuItmeListAtom, curPostRefAtomRead, isFlipAtom } from "../jotai";
import PostMenu, { postMenuHandler, buildMenuItemFn } from "components/PostMenu/PostMenu";
import { MenuItem } from "@szhsin/react-menu";
import { BiCopyAlt, BiRepost } from "react-icons/bi";
import { MdOutlineQuickreply } from "react-icons/md";
import classNames from "classnames";

type IPostProp = {
  curItem?: postData
  curBa: { name: string, fid: string }
}
interface PostHandle {
  show: () => void
}
export interface CommentInfo {
  type: string
  proId?: string
  userName?: string
  repostid?: string
  quoteId?: string
}


const dSize = isLowResolution() ? '90vw' : '700px'
const Post: React.FC<IPostProp & RefAttributes<PostHandle>> = forwardRef(({ curItem, curBa }, ref) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState<postTData[]>()
  const curCommRef = useAtomValue(curCommRefAtomRead)
  const curPostRef = useAtomValue(curPostRefAtomRead)
  // const [curComment, setCurComment] = useState()
  const curPageRef = useRef(1)
  // const [curPage, setCurPage] = useState(1)
  const [total, setTotal] = useState(1)
  const postMenuRef = useRef<postMenuHandler>(null)
  const replyRef = useRef<ReplayHandle>(null)
  const tbRender = useToolBarRender()
  const [isFlip] = useAtom(isFlipAtom)

  console.log(`rerender`,);
  const show = () => {
    setVisible(true)
  }
  const menuClick = useCallback((e: any) => {
    // console.log("🚀 ~ file: index.tsx ~ line 52 ~ menuClick ~ e", e)
    if (e.value == 'copy') {
      let curPost = curPostRef.current as postTData
      console.log("🚀 ~ file: Post.tsx ~ line 55 ~ menuClick ~ curPost", curPost)
      if (curPost.content) {
        copyToPaste(JSON.stringify(curPost.content))
      } else {
        let curPost2 = curPostRef.current as {
          type: string;
          val: string;
          proId: string;
        }[]
        let str = curPost2?.reduce((pre, cur) => {
          let strItem = pre + (cur.type == 'text' ? cur.val : '')
          return strItem
        }, '')
        // console.log("🚀 ~ file: Post.tsx ~ line 65 ~ str ~ str", str)
        copyToPaste(str)
      }

      return
    }
    replyRef.current?.outerShow()
    // toggleMenu(true)
    // let obj: any = {
    //   jumpUrl: () => {
    //     window.open('https://tieba.baidu.com' + curItem?.url)
    //   }
    // }
    // obj[e.value] && obj[e.value]()

  }, [])
  const buildMenuItem = useCallback<buildMenuItemFn>((setCurMenuItemList) => {
    if (curCommRef.current.userName) {
      setCurMenuItemList([{ name: `回复【${curCommRef.current.userName}】`, value: 'floorIn', icon: <MdOutlineQuickreply className={'text-lg mr-1'} /> }])
    } else {
      setCurMenuItemList([{ name: `回复层`, value: 'floor', icon: <BiRepost className={'text-lg mr-1'} /> }])
    }
  }, [])
  const hide = useCallback(() => {
    setVisible(false)
  }, [])
  const getData = () => {
    if (!curItem) return
    curCommRef.current = {}
    setLoading(true)
    sleep(50).then(() => {
      setPostList([])
    })
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
  const refreshAfterReply = useCallback(() => {
    curPageRef.current * 30 == total && getData()
    console.log("🚀 ~ file: Post.tsx ~ line 91 ~ refreshAfterReply ~ curPageRef.current * 30", curPageRef.current * 30, total)
  }, [curItem, total])

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // buildMenuItem()
    e.preventDefault()
    postMenuRef.current?.activeMenu(e)
  }, [])

  useEffect(() => {
    curPageRef.current = 1
    setTotal(30)
    curItem && getData()
  }, [curItem])

  useImperativeHandle(ref, () => ({
    // compClick
    show
  }))
  const layerClick = (item: postTData) => {
    curCommRef.current = { quoteId: item.id }
    curPostRef.current = item
  }
  const renderRow = () => {
    const renderAuthor = (author: string | any[]) => {
      // console.log("🚀 ~ file: useDetail.tsx ~ line 145 ~ renderAuthor ~ author", author)
      if (typeof author == 'string') {
        return author
      }
      return author.map((e,idx) => {
        let obj: any = {
          text: () => e.val
          , img: () => <img className={'relative top-0.5'} key={idx} style={{ width: '16px' }} src={e.val} />
        }
        obj['vipText'] = obj.text
        return obj[e.type] && obj[e.type]()
      })
    }
    return postList?.map((e,idxx) => {
      const renderContent = () => {
        if (typeof e.content == 'string') {
          return e.content
        } else {
          return e.content.map((ce, idx) => {
            let obj: any = {
              text: () => {
                return <div className={'inline-block'} key={idx}>{ce.val}</div>
              }
              , face: () => <div className={'inline-block relative top-0.5'} key={idx}><img style={{ width: "30px" }} src={ce.val} /></div>
              , br: () => <div key={idx}></div>
              , img: () => <div className={'inline-block mr-1'} key={idx} >
                <PhotoView src={ce.val} >
                  <img src={ce.val} onMouseDown={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation(); }} style={{ width: '50px' }} alt="" />
                </PhotoView>
                {/* </PhotoProvider> */}
                {/* <NImage width="50" src={ce.val} /> */}
              </div>
            }
            // console.log(`obj[ce.type]`,ce,obj[ce.type]);
            return obj[ce.type] && obj[ce.type]()
          })
        }
      }
      return (
        <div className={'text-slate-400  bg-neutral-700/20 p-3 mx-3 my-2 rounded materialPage'}
          // style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}
          onContextMenu={(ev) => { ev.stopPropagation(); layerClick(e); handleContextMenu(ev) }} key={idxx}>
          <div className={'inline-block w-4/5 text-left'}>
            {/* <div className={'text-base'}>{item.title}</div> */}
            <div className={'text-sm leading-relaxed'}>
              <PhotoProvider className={'select-none'} photoClassName={classNames({ 'flipX': isFlip[0], 'flipY': isFlip[1] })} maskOpacity={0.5} speed={() => 300} toolbarRender={tbRender} loop={false} >
                {renderContent()}
              </PhotoProvider>
            </div>
            <SubPost handleContextMenu={handleContextMenu} postItem={e} curItem={curItem} />
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
      <div className={'w-full h-full relative overflow-hidden' } id={'reply-draw-container'}>
        <MySkeleton loading={loading}>
          <MacScrollbar skin={'dark'} className={'w-full h-full relative'} >
            {renderRow()}
          </MacScrollbar>
        </MySkeleton>
        <Replay refreshAfterReply={refreshAfterReply} curBa={curBa} curItem={curItem} ref={replyRef} />
        <PostMenu menuClick={menuClick} ref={postMenuRef} buildMenuItem={buildMenuItem} >
          <MenuItem className={menuClassName} value={'copy'} ><BiCopyAlt className={'text-lg mr-1'} /> 复制</MenuItem>
        </PostMenu>
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
      className={'p-0 noPadDrawer'}
      showInAttachedElement
      attach="#post-draw-container"
      header={curItem?.title}
      body={renderBody()}
      footer={renderFooter()}
      visible={visible}
      onClose={hide}
      size={dSize}
    >
    </Drawer >
  )

})

Post.displayName = 'Post'

export default memo(Post);