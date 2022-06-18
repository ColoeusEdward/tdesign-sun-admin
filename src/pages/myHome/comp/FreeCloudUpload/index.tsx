import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { recordFree } from "services/nt";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type IFreeCloudUploadProp = {
  children?: ReactNode
  name: string
}

const FreeCloudUpload: React.FC<IFreeCloudUploadProp> = forwardRef(({ children }, ref) => {
  const valRef = useRef<string[]>([])
  const texatARef = useRef<any>(null)
  const [cloudPath, setCloudPath] = useState<InputValue>('')

  const valChange = (list: string[]) => {
    valRef.current = list
  }

  const pathChange = (str: InputValue) => {
    setCloudPath(str)
  }

  const submit = () => {
    console.log(`submit`,valRef.current,cloudPath);
    let data = {
      name_list: valRef.current
      , target: cloudPath
    }
    recordFree(data).then(() => {
      texatARef.current!.cleanVal()
      setCloudPath('')
    })
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex-col flex '}  >
      {children}
      <TextareaToList ref={texatARef} onValChange={valChange} ></TextareaToList>
      <Row className="px-3"><Input value={cloudPath} onChange={pathChange} placeholder={'输入云盘路径'} clearable /></Row>
      <div className=" p-3">
        <Button shape="round"  block variant="base" onMouseUp={submit} >
          提 交
        </Button>
      </div>

    </div>
  )

})

export default memo(FreeCloudUpload);