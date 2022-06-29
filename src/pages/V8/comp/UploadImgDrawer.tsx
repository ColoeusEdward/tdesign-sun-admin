import { useAtom, useAtomValue } from "jotai";
import { FC, ForwardedRef, forwardRef, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BsFileEarmarkImage } from "react-icons/bs";
import { upload_tb_img } from "services/nt";
import { Button, Drawer, Input, Select, SelectValue, Textarea, TextareaValue } from "tdesign-react";
import Option from "tdesign-react/es/select/base/Option";
import { postData } from "types";
import { isLowResolution } from "utils/util";
import { curCommRefAtomRead } from "../jotai";

type IUploadImgDrawerProp = {
  curBa: { name: string, fid: string }
  onUploadFinish: Function
  // ba: { name: string, fid: string }
  // setBa: Function
}
export interface ReplayHandle {
  outerShow: Function
}
const innerHeight = window.innerHeight


const UploadImgDrawer: FC<IUploadImgDrawerProp & RefAttributes<ReplayHandle>> = forwardRef(({ curBa, onUploadFinish }, ref) => {
  const [drawShow, setDrawShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState<TextareaValue>('')
  // const [replyState, setReplyState] = useState<'building' | 'floor'>('building')
  const curCommRef = useAtomValue(curCommRefAtomRead)

  const outerShow = () => {
    setDrawShow(true)
  }
  const submit = (val: any, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    if (e.key != 'Enter' || val.length == 0) return
    upload_tb_img({ fid: curBa.fid, url: val }).then(res => {
      console.log("🚀 ~ file: UploadImgDrawer.tsx ~ line 36 ~ upload_tb_img ~ res", res)
      let imgUrl = res.urls[0].pic_url_no_auth
      let height = res.urls[0].fullpic_height
      let width = res.urls[0].fullpic_width
      let imgStr = `[img pic_type=1 width=${width} height=${height}]${imgUrl}[/img]`
      onUploadFinish(imgStr)
      setVal('')
    })

  }
  const hide = useCallback(() => {
    setDrawShow(false)
  }, [])
  useImperativeHandle(ref, () => ({
    outerShow
  }))

  return (
    <>
      <Button className={'absolute bottom-5 right-5 '} shape={'round'} icon={<BsFileEarmarkImage className="text-lg" />} onClick={() => { setDrawShow(true) }} ></Button>
      <Drawer
        header={false}
        body={
          <div className={'pt-4 px-3'}>
            <Input clearable value={val} placeholder={'请输入图片url'} onKeyup={submit} onChange={(v) => { setVal(v) }} ></Input>
          </div>
        }
        closeBtn={false}
        showInAttachedElement
        footer={false}
        visible={drawShow}
        onClose={hide}
        size={'80px'}
        placement={'top'}
      >
      </Drawer>
    </>
  )

})

export default memo(UploadImgDrawer);