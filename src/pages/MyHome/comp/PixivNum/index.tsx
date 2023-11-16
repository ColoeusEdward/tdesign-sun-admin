import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { SiPixiv } from "react-icons/si";
import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";


type IPixivNumProp = {
  children?: ReactNode
  name: string
}

const PixivNum: React.FC<IPixivNumProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    // if(e.key != 'Enter') return
    window.open(`https://www.pixiv.net/artworks/${url}`)
    setUrl('')
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex items-center'}  >
      {/* {children} */}
      <Row className="px-3 w-full"><Input prefixIcon={<SiPixiv />} type={'search'} onEnter={submit} value={url}  onChange={(e) => { setUrl(e) }} placeholder={'输入Pixiv号'} clearable /></Row>
    </div>
  )

})

export default memo(PixivNum);