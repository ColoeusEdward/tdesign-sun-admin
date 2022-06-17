import { forwardRef, memo, ReactNode, useImperativeHandle } from "react";
import useLinkBtnLogic from "../hook/useLinkBtnLogic";

type ILinkBtnProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
}

const LinkBtn: React.FC<ILinkBtnProp> = forwardRef(({ clickFn, children, name }, ref) => {
  const { getRunLogic } = useLinkBtnLogic()
  const compClick = () => {
    clickFn && clickFn()
    const logic = getRunLogic(name)
    logic && logic()
  }
  useImperativeHandle(ref, () => ({
    compClick
  }))
  return (
    <div className={'w-full h-full'}  >
      {children}
    </div>
  )

})

export default memo(LinkBtn);