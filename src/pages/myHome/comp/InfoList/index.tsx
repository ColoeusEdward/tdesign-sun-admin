import MySkeleton from "components/MySkeleton";
import { forwardRef, memo, ReactNode, useImperativeHandle, useState } from "react";

type IInfoListProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
}

const InfoList: React.FC<IInfoListProp> = forwardRef(({ clickFn, children, name }, ref) => {
  const [loading, setLoading] = useState(false)
  const compClick = () => {

  }
  useImperativeHandle(ref, () => ({
    // compClick
  }))
  return (
    <div className={'w-full h-full'}  >
      {children}
      <MySkeleton loading={loading}>
        <div className={'w-full h-full'}>

        </div>
      </MySkeleton>
    </div>
  )

})

export default memo(InfoList);