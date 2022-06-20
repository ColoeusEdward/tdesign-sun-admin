import { useSize } from "ahooks";
import classNames from "classnames";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Skeleton, Textarea, TextareaValue } from "tdesign-react";

type IMySkeletonProp = {
  children: ReactNode
  loading: boolean
}

const MySkeleton: FC<IMySkeletonProp & RefAttributes<unknown>> = forwardRef(({ children, loading }, ref) => {
  const conRef = useRef(null)
  const size = useSize(conRef)
  const [lineCount, setLineCount] = useState(1)

  useImperativeHandle(ref, () => ({
    // cleanVal
  }))
  const renderSks = () => {
    return new Array(lineCount).fill((
      <Skeleton className={'mb-2'} theme='paragraph' animation="gradient" >{'.'}</Skeleton>
    ))
  }
  useEffect(() => {
    if (size) {
      setLineCount(Math.floor((size.height - 24) / 70))
    }
  }, [size])
  return (
    <div className={'h-full w-full'} ref={conRef} >
      {loading &&
        <div className={'absolute w-full h-full top-0 left-0 p-3'}>
          {renderSks()}
        </div>}
      {!loading && children}
    </div>
  )

})

export default memo(MySkeleton);