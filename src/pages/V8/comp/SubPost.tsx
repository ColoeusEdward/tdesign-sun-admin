import MySkeleton from "components/MySkeleton";
import { useAtomValue } from "jotai";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { get_page_tb_comment } from "services/nt";
import { Pagination, Textarea, TextareaValue } from "tdesign-react";
import { postData, postTData } from "types";
import { curCommRefAtomRead, curPostRefAtomRead } from "../jotai";

type ISubPostProp = {
  // reList: any[]
  curItem: postData | undefined
  postItem: postTData
  handleContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void
}

const SubPost: FC<ISubPostProp & RefAttributes<unknown>> = forwardRef(({ curItem, postItem, handleContextMenu }, ref) => {
  const [loading, setLoading] = useState(false)
  const curPageRef = useRef(1)
  const [reList, setReList] = useState(postItem.reList)
  const curCommRef = useAtomValue(curCommRefAtomRead)
  const curPostRef = useAtomValue(curPostRefAtomRead)
  useImperativeHandle(ref, () => ({

  }))
  const commentClick = (item: any) => {
    // debugger
    curCommRef.current = { quoteId: item[0].quoteId, proId: item[0].proId, userName: item[0].val.split(': ')[0], repostid: item[0].repostid }
    curPostRef.current = item
  }

  const getNewComment = () => {
    if (!curItem) return
    setLoading(true)
    get_page_tb_comment({ tid: curItem.url.split('/')[2], pid: postItem.id, p: curPageRef.current })
      .then((list) => {
        console.log("🚀 ~ file: SubPost.tsx ~ line 35 ~ .then ~ list", list)
        list && setReList(list)
      }).finally(() => {
        setLoading(false)
      })
    // buildNewReList(res)
    // console.log("🚀 ~ file: useDetail.tsx ~ line 218 ~ getNewComment ~ res", res)
  }
  const curPageChange = (current: number) => {
    curPageRef.current = current
    getNewComment()
  }

  useEffect(() => {
    curPageRef.current = 1
  }, [postItem])

  const renderPagi = () => {
    return <Pagination size="small" total={postItem.pageCount * 10} totalContent={false}
      current={curPageRef.current}
      defaultPageSize={10}
      onCurrentChange={curPageChange}
      showPageSize={false} />
  }

  let list = reList && reList.map(ee => {
    return <div className={'p-1 leading-relaxed hover:bg-slate-800 rounded-md'} onMouseDown={(e) => { e.stopPropagation(); }} onContextMenu={(ev) => { ev.stopPropagation(); commentClick(ee); handleContextMenu(ev); }} >
      {ee.map((eee: any, idx: number) => {
        let obj: any = {
          text: () => {
            let matchRes = eee.val.match(/【(\S+)】/)
            if (matchRes) {
              return ['【', <div className={'inline-block text-amber-500'}>{matchRes[1]}</div>, '】']
            }
            if (idx != 0) {
              return eee.val
            }
            let list = eee.val.split(': ')
            return [<div className={'inline-block text-amber-500'}>{list[0]}</div>, ': ', list[1]]
          }
          , img: () => <div className={'inline-block relative top-0.5'}><img style={{ width: "16px" }} src={eee.val} /></div>
        }
        return obj[eee.type] && obj[eee.type]()
      })}
    </div>

  })
  return (
    <>
      {reList && reList.length > 0 && (
        <div className={'text-sm bg-black p-1 rounded-md relative overflow-hidden pb-2'} >
          <MySkeleton loading={loading} >
            <div className={'w-full h-full'}>
              {list}
              {postItem.reData && postItem.pageCount >= 2 && renderPagi()}
            </div>
          </MySkeleton>
        </div>
      )}
    </>
  )

})

export default memo(SubPost);