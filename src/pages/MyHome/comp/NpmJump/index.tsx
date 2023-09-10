import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImNpm } from "react-icons/im";

import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";


type INpmJumpProp = {
  children?: ReactNode
  name: string
}

const NpmJump: React.FC<INpmJumpProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')
  const [url2, setUrl2] = useState<InputValue>('')

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    // if(e.key != 'Enter') return
    window.open(`https://www.npmjs.com/search?q=${url}`)
    setUrl('')
  }
  const submit2 = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    // if(e.key != 'Enter') return
    window.open(`https://www.dmhy.org/topics/list?keyword=${url2}`)
    setUrl2('')
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex items-center flex-col justify-center'}  >
      {/* {children} */}
      <Row className="px-3 w-full relative top-1"><Input prefixIcon={<ImNpm />} type={'search'} onEnter={submit} value={url}  onChange={(e) => { setUrl(e) }} placeholder={'输入Npm包名'} clearable /></Row>
      <Row className="px-3 w-full relative top-1 my-2"><Input prefixIcon={<img src="https://www.dmhy.org/favicon.ico" className=" h-1/2" />} type={'search'} onEnter={submit2} value={url2}  onChange={(e) => { setUrl2(e) }} placeholder={'输入番名'} clearable /></Row>
    </div>
  )

})

export default memo(NpmJump);