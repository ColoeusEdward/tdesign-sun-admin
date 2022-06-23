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
      let lc = Math.floor((size.height - 24) / 70)
      // console.log("🚀 ~ file: index.tsx ~ line 27 ~ useEffect ~ lc", lc)
      setLineCount(lc > 0 ? lc : 1)
    }
  }, [size])
  return (
    <div className={'h-full w-full'} ref={conRef} >
      <div className={classNames('absolute w-full h-full top-0 left-0 p-3', { 'hidden': !loading })}>
        {renderSks()}
      </div>
      {/* {loading &&
        <div className={classNames('absolute w-full h-full top-0 left-0 p-3',{'hidden':!loading})}>
          {renderSks()}
        </div>} */}
      {/* {!loading && children} */}
      <div className={classNames('w-full h-full', { 'invisible': loading, })}>
        {children}
      </div>
    </div>
  )

})

export default memo(MySkeleton);