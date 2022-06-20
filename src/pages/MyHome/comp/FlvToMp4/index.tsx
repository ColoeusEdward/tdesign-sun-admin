import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { RmFile, to_mp4 } from "services/nt";
import { Button, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type IFlvToMp4Prop = {
  children?: ReactNode
  name: string
}

const FlvToMp4: React.FC<IFlvToMp4Prop> = forwardRef(({ children }, ref) => {
  const valRef = useRef([''])
  const texatARef = useRef<any>(null)
  const valChange = (str: string[]) => {
    valRef.current = str
  }
  const submit = () => {
    if(!valRef.current[0]) return
    let data = { name_list: valRef.current }
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ data", data)
    to_mp4(data).then(() => {
      texatARef.current.cleanVal()
    })

  }
  useImperativeHandle(ref, () => ({

  }))
  return (
    <div className={'h-full'}  >
      {children}
      <div className="pt-3"></div>
      <TextareaToList ref={texatARef} onValChange={valChange} ></TextareaToList>
      <div className=" p-3 ">
        <Button shape="round" block variant="base" onMouseUp={submit} >
          提 交
        </Button>
      </div>

    </div>
  )

})

export default memo(FlvToMp4);