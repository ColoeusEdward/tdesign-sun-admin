import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { RmFile, sync_video_to_you } from "services/nt";
import { Button, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type ISyncToYouProp = {
  children?: ReactNode
  name: string
}

const SyncToYou: React.FC<ISyncToYouProp> = forwardRef(({ children }, ref) => {
  const valRef = useRef('')
  const texatARef = useRef<any>(null)
  const processVal = (val: TextareaValue) => {
    return String(val).replace(/\n/g, ',')
  }
  const valChange = (str: string) => {
    valRef.current = str
  }
  const submit = () => {
    let data = { fileName: valRef.current }
    console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ data", data)
    sync_video_to_you({ url: valRef.current }).then((res) => {
      console.log("🚀 ~ file: index.tsx ~ line 24 ~ sync_video_to_you ~ res", res)
      texatARef.current.cleanVal()
    })

  }
  useImperativeHandle(ref, () => ({

  }))
  return (
    <div className={'h-full'}  >
      {children}
      <div className="pt-3"></div>
      <TextareaToList ref={texatARef} onValChange={valChange} processFn={processVal} ></TextareaToList>
      <div className=" p-3 ">
        <Button shape="round" block variant="base" onMouseUp={submit} >
          提 交
        </Button>
      </div>

    </div>
  )

})

export default memo(SyncToYou);