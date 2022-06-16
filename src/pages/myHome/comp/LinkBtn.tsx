import { forwardRef, memo, useImperativeHandle } from "react";


const LinkBtn = ({ clickFn }: any, ref: any) => {

  useImperativeHandle(ref, () => ({
      compClick() {
        clickFn && clickFn()
      }
    })
  )
  return (
    <div className={'w-full h-full bg-red-400'}  >

    </div>
  )

}


export default memo(forwardRef(LinkBtn));