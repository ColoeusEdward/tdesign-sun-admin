import { useSize } from "ahooks";
import classNames from "classnames";
import WaveProcess from "components/WaveProcess";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CheckCircleFilledIcon } from "tdesign-icons-react";
import { Skeleton, Textarea, TextareaValue, Upload, UploadFile } from "tdesign-react";
import { sleep } from "utils/util";
import Style from './index.module.less'

type IMyUploaderProp = {
  children: ReactNode
  uploadFn?: Function
}

const MyUploader: FC<IMyUploaderProp & RefAttributes<{ trigger: Function }>> = forwardRef(({ children, uploadFn }, ref) => {
  const conRef = useRef(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [uploading, setUploading] = useState(false)
  // const size = useSize(conRef)
  const [files, setFiles] = useState<any[]>([])
  const [prog, setProg] = useState(0)

  const resetProg = () => {
    sleep(1000).then(() => {
      setProg(0)
    })
  }
  const handleProgressEvent = (progressEvent: any) => {
    console.log("🚀 ~ file: MyUploader.tsx ~ line 29 ~ handleProgressEvent ~ progressEvent", progressEvent)
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log("🚀 ~ file: MyUploader.tsx ~ line 32 ~ handleProgressEvent ~ percentCompleted", percentCompleted)
    setProg(percentCompleted)
    if (percentCompleted == 100) {
      resetProg()
    }
  }

  const beforeUpload = useCallback(
    (file: UploadFile): boolean | Promise<boolean> =>
      new Promise((resolve, reject) => {
        // setName('name2');
        console.log("🚀 ~ file: MyUploader.tsx ~ line 19 ~ constMyUploader:FC<IMyUploaderProp&RefAttributes<unknown>>=forwardRef ~ file", file)
        setUploading(true)
        uploadFn && uploadFn(file.raw, handleProgressEvent)
          .then(() => sleep(1000))
          .then(() => {
            setUploading(false)
          }).finally(() => {
            setUploading(false)
          })
        resolve(false);
      }), [])

  const handleChange = useCallback((files: any[]) => {
    setFiles(files);
  }, []);

  const trigger = () => {
    triggerRef.current?.click()
  }

  useImperativeHandle(ref, () => ({
    // cleanVal
    trigger
  }))

  // useEffect(() => {
  //   console.log("🚀 ~ file: MyUploader.tsx ~ line 35 ~ handleChange ~ files", files)
  // }, [files])

  return (
    <>
      <div className={'absolute -z-20'}>
        <Upload
          headers={{ 'naive-info': 'hello!' }}
          action="2"
          files={files}
          onChange={handleChange}
          // onFail={handleFail}
          // onSuccess={handleSuccess}
          theme="custom"
          beforeUpload={beforeUpload as any}
        >
          <div ref={triggerRef}></div>
        </Upload>
      </div>
      {children}
      {uploading && <WaveProcess prog={prog} ></WaveProcess>}
    </>
  )

})

export default memo(MyUploader);