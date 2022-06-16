import { forwardRef, memo, useImperativeHandle } from "react";


const Recover = ({ clickFn }: any, ref: any) => {

  useImperativeHandle(ref, () => (
    {
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


export default memo(forwardRef(Recover));