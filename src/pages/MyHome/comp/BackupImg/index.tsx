import { forwardRef, memo, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";
import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";

type IBackupImgProp = {
  children?: ReactNode
  name: string
}

const BackupImg: React.FC<IBackupImgProp> = forwardRef(({ children }, ref) => {
  const [url, setUrl] = useState<InputValue>('')

  const submit = (val: InputValue, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    // console.log("🚀 ~ file: index.tsx ~ line 22 ~ submit ~ url", url,e.key)
    if(e.key != 'Enter') return
    backup_img({ imgurl: url as string }).then(() => {
      setUrl('')
    })
  }
  useImperativeHandle(ref, () => ({

  }))

  return (
    <div className={'h-full flex items-center'}  >
      {/* {children} */}
      <Row className="px-3 w-full"><Input prefixIcon={<FileImageIcon />} value={url} onKeydown={submit} onChange={(e) => { setUrl(e) }} placeholder={'输入图片url'} clearable /></Row>
    </div>
  )

})

export default memo(BackupImg);