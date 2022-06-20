import { useAtom } from "jotai";
import { memoryAtom } from "jtStore/home";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

type IMemChartProp = {
  children?: ReactNode
  name: string
}

const MemChart: React.FC<IMemChartProp> = forwardRef(({ children }, ref) => {

  const [memory] = useAtom(memoryAtom)
  const [show, setShow] = useState(false)

  return (
    <div className={'h-full w-full'}  >
      
    </div>
  )

})

export default memo(MemChart);