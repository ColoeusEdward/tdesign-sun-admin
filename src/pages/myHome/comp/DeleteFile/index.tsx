import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Button, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type IDeleteFileProp = {
  children?: ReactNode
  name: string
}

const DeleteFile: React.FC<IDeleteFileProp> = forwardRef(({ children }, ref) => {
  const valRef = useRef('')
  const processVal = (val: TextareaValue) => {
    return String(val).replace(/\n/g, ',')
  }
  const valChange = (str: string) => {
    console.log("🚀 ~ file: index.tsx ~ line 16 ~ valChange ~ str", str)
    valRef.current = str
  }
  const submit = () => {

  }
  useImperativeHandle(ref, () => ({

  }))
  return (
    <div className={'h-full flex-col flex '}  >
      {children}
      <TextareaToList onValChange={valChange} processFn={processVal} ></TextareaToList>
      <div className=" p-3">
      <Button block variant="base" onClick={submit} >
        提 交
      </Button>
      </div>
      
    </div>
  )

})

export default memo(DeleteFile);