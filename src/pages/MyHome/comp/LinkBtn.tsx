import MyUploader from "components/MyUploader/MyUploader";
import { ElementRef, forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { TdUploadFile } from "tdesign-react/es/upload/types";
import useLinkBtnLogic from "../hook/useLinkBtnLogic";

type ILinkBtnProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
  type: string
}

const LinkBtn: React.FC<ILinkBtnProp> = forwardRef(({ clickFn, children, name, type }, ref) => {
  const { getRunLogic, getUploadFn } = useLinkBtnLogic()
  const uploaderRef = useRef<ElementRef<typeof MyUploader>>(null)


  const compClick = () => {
    clickFn && clickFn()
    const logic = getRunLogic(name)
    logic && logic()
    type == 'uploadBtn' && uploaderRef.current?.trigger()
  }

  const submit = useCallback((file: Blob, handleProgressEvent: () => void) => {
    const uploadFn = getUploadFn(name)
    const fdata = new FormData()
    fdata.append('files', file)
    return uploadFn(fdata, handleProgressEvent)
  }, [])

  useImperativeHandle(ref, () => ({
    compClick
  }))
  return (
    <div className={'w-full h-full overflow-hidden'}  >
      {(type == 'btn' || !type) && children}
      {type == 'uploadBtn' && <MyUploader ref={uploaderRef} uploadFn={submit} >{children}</MyUploader>}
    </div>
  )

})

export default memo(LinkBtn);