import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useImperativeHandle, useState } from "react";
import { Textarea, TextareaValue } from "tdesign-react";

type ITextareaToListProp = {
  onValChange: Function
  processFn?: Function
}

const TextareaToList: FC<ITextareaToListProp&RefAttributes<unknown>> = forwardRef(({ onValChange, processFn }, ref) => {
  const [val, setVal] = useState<TextareaValue>('')
  const valToList = (val: TextareaValue) => {
    let list = String(val).split('\n')
    return list
  }
  const valChange = (val: TextareaValue) => {
    setVal(val)
    let res = processFn ? processFn(val) : valToList(val)
    onValChange(res)
  }
  const cleanVal = () => {
    setVal('')
  }
  useImperativeHandle(ref, () => ({
    cleanVal
  }))
  return (
    <div className={''}  >
      <div className=" p-3" >
        <Textarea  className={' text-center '} placeholder="多项用回车分割" value={val} onChange={valChange} autosize={{ minRows: 5, maxRows: 5 }}></Textarea>
      </div>
    </div>
  )

})

export default memo(TextareaToList);