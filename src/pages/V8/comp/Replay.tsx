import { useMouse } from "ahooks";
import { CursorState } from "ahooks/lib/useMouse";
import { useAtom, useAtomValue } from "jotai";
import { mouseAtom } from "jtStore/home";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { reply_comment, reply_tb } from "services/nt";
import { Button, Drawer, Select, SelectValue, Textarea, TextareaValue } from "tdesign-react";
import Option from "tdesign-react/es/select/base/Option";
import { postData } from "types";
import { isLowResolution } from "utils/util";
import { curCommRefAtomRead } from "../jotai";
import { CommentInfo } from "./Post";

type IReplyProp = {
  curBa: { name: string, fid: string }
  curItem?: postData
  refreshAfterReply:() => void
  // ba: { name: string, fid: string }
  // setBa: Function
}
type IReplyBtnProp = {
  setShow: Function
  replyStateRef: React.MutableRefObject<"building" | "floor">
}
export interface ReplayHandle {
  outerShow: Function
}
const innerHeight = window.innerHeight

const ReplyBtn = memo(({ setShow, replyStateRef }: IReplyBtnProp) => {

  const [mouse] = useAtom(mouseAtom)
  const clientY = mouse?.clientY || 0
  const getYposi = () => {
    let yp = 100
    clientY > (innerHeight - 100) && (yp = 0)
    clientY <= (innerHeight - 100) && (yp = 40)
    return yp
  }
  return (
    <div className={'fixed right-96 -bottom-4'}
      style={{
        transition: 'transform 0.2s ease-in-out', transform: `translate3d(0px, ${getYposi()}px,0px) rotate(90deg)`
      }}>
      <Button shape="round" onClick={() => { setShow(true); replyStateRef.current = 'building' }} icon={<FiChevronLeft className={'text-lg'} />} >
        <div className={'w-6'} ></div>
      </Button>
    </div>
  )
})


const Reply: FC<IReplyProp & RefAttributes<ReplayHandle>> = forwardRef(({ curBa, curItem,refreshAfterReply }, ref) => {
  const [drawShow, setDrawShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState<TextareaValue>('')
  // const [replyState, setReplyState] = useState<'building' | 'floor'>('building')
  const replyStateRef = useRef<'building' | 'floor'>('building')
  const curCommRef = useAtomValue(curCommRefAtomRead)

  const outerShow = () => {
    setDrawShow(true)
    replyStateRef.current = 'floor'
  }
  const submit = () => {
    const valP = String(val).replaceAll('\n', '[br]')
    if (!curItem) return
    let data: any = { fid: curBa.fid, fname: curBa.name, tid: curItem.url.split('/')[2], content: valP }
    setLoading(true)
    if (replyStateRef.current == 'floor' && curCommRef.current) {  //回复层及楼中楼
      data['quoteId'] = curCommRef.current.quoteId
      curCommRef.current.repostid && (data['repostid'] = curCommRef.current.repostid)
      if (curCommRef.current.userName) {
        Object.assign(data, {
          content: `回复 [showname portrait=${curCommRef.current.proId} use=reply]${curCommRef.current.userName}[/showname] :${valP}`,
          hasReplyName: true
        })
      }
      reply_comment(data).then((res: any) => {
        if (res['err_code'] == 0) {
          setVal('')
          setDrawShow(false)
        }
      }).finally(() => {
        setLoading(false)
      })
    } else {        //回复主楼
      reply_tb(data).then((res: any) => { 
        if (res['err_code'] == 0) {
          setVal('')
          refreshAfterReply()
          setDrawShow(false)
        }
      }).finally(() => {
        setLoading(false)
      })
    }


  }
  const hide = useCallback(() => {
    setDrawShow(false)
  }, [])
  useImperativeHandle(ref, () => ({
    outerShow
  }))

  const renderBody = () => {
    return (
      <div className={'p-3'}>
        <Textarea placeholder="" value={val} onChange={(e) => { setVal(e) }} autosize={{ minRows: 6, maxRows: 6 }}></Textarea>
      </div>
    )
  }
  return (
    <>
      <ReplyBtn setShow={setDrawShow} replyStateRef={replyStateRef} />
      <Drawer
        header={'回复'}
        body={renderBody()}
        showInAttachedElement
        footer={
          <div className={'flex justify-center'}>
            <Button className={' w-4/5'} loading={loading} shape="round" onClick={submit}  >提 交</Button>
          </div>
        }
        visible={drawShow}
        onClose={hide}
        size={'300px'}
        placement={'bottom'}
        showOverlay={true}
      >
      </Drawer>
    </>
  )

})

export default memo(Reply);