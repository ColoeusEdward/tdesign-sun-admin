import { useSize } from "ahooks";
import classNames from "classnames";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CheckCircleFilledIcon } from "tdesign-icons-react";
import { sleep } from "utils/util";
import Style from './index.module.less'

type IWaveProcessProp = {
  // children: ReactNode
  prog: number
}

const WaveProcess: FC<IWaveProcessProp & RefAttributes<unknown>> = forwardRef(({ prog = 0 }, ref) => {
  const conRef = useRef(null)
  // const size = useSize(conRef)
  const [conStyle, setConStyle] = useState({ top: '100%' })
  const [completeStyle, setCompleteStyle] = useState({ top: '0' })

  const pgCompute = () => {
    if (prog != 100) {
      return prog
    } else {
      return 0
    }
  }
  const barStyle = {
    left: (pgCompute() - 100) + '%'
  }

  const showProgress = () => {
    setConStyle({ top: '0' })
  }
  const hideProgress = () => {
    setConStyle({ top: '100%' })
  }
  const showComplete = async () => {
    // console.log(`shwocomplate`,);
    setCompleteStyle({top:'-100%'})
    await sleep(2000)
    setCompleteStyle({top:'0'})
    hideProgress()
  }

  useImperativeHandle(ref, () => ({
    // cleanVal
  }))

  useEffect(() => {
    if (prog > 1) {
      showProgress()
    }
    if (prog == 100) {
      console.log(`upload over`,);
      showComplete()
    }
  }, [prog])
  return (
    <div className={classNames('h-full w-full absolute overflow-hidden top-full transition-all', Style.con)} ref={conRef} style={conStyle} >
      <div className={Style.bar} style={barStyle} >
        <div className={Style.Gwave} ></div>
      </div>
      <div className={Style.complete} style={completeStyle}>
        <CheckCircleFilledIcon style={{ fontSize: '20px' }} />
      </div>
    </div>
  )

})

export default memo(WaveProcess);