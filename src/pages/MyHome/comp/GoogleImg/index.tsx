import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";


type IGoogleImgProp = {
  children?: ReactNode
  name: string
}

const GoogleImg: React.FC<IGoogleImgProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    if(e.key != 'Enter') return
    window.open(`https://www.google.com/searchbyimage?image_url=${url}`)
    setUrl('')
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex items-center'}  >
      {/* {children} */}
      <Row className="px-3 w-full"><Input prefixIcon={<FcGoogle />} value={url} onKeydown={submit} onChange={(e) => { setUrl(e) }} placeholder={'输入图片url'} clearable /></Row>
    </div>
  )

})

export default memo(GoogleImg);