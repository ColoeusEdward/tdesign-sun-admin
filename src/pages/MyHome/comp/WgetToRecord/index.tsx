import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { FcDownload,  } from "react-icons/fc";
import { wget_to_record } from "services/nt";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";


type WgetToRecordProp = {
  children?: ReactNode
  name: string
}

const WgetToRecord: React.FC<WgetToRecordProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    // if(e.key != 'Enter') return
    wget_to_record(url).then(() => {
      
    })
    setUrl('')
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex items-center'}  >
      {/* {children} */}
      <Row className="px-3 w-full"><Input prefixIcon={<FcDownload />} type={'search'} onEnter={submit} value={url}  onChange={(e) => { setUrl(e) }} placeholder={'输入url'} clearable /></Row>
    </div>
  )

})

export default memo(WgetToRecord);