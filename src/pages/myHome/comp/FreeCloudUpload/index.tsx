import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type IFreeCloudUploadProp = {
  children?: ReactNode
  name: string
}

const FreeCloudUpload: React.FC<IFreeCloudUploadProp> = forwardRef(({ children }, ref) => {
  const valRef = useRef<string[]>([])
  const [cloudPath, setCloudPath] = useState<InputValue>('')

  const valChange = (list: string[]) => {
    valRef.current = list
  }

  const pathChange = (str: InputValue) => {
    setCloudPath(str)
  }

  const submit = () => {

  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex-col flex '}  >
      {children}
      <TextareaToList onValChange={valChange} ></TextareaToList>
      <Row className="px-3"><Input value={cloudPath} onChange={pathChange} placeholder={'输入云盘路径'} clearable /></Row>
      <div className=" p-3">
        <Button shape="round"  block variant="base" onClick={submit} >
          提 交
        </Button>
      </div>

    </div>
  )

})

export default memo(FreeCloudUpload);