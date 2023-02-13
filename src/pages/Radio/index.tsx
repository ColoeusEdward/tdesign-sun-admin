import { useAtom } from "jotai";
import { memoryAtom } from "jtStore/home";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import ReactECharts from 'echarts-for-react';
import { sleep } from "utils/util";
import { useAtomCallback } from "jotai/utils";
import withKeepAlive from "hooks/withKeepAlive";
import OpenRadio from "./OpenRadio";

type IRadioProp = {
  children?: ReactNode
  name: string,

}
let curAudioData = null
const Radio: React.FC<IRadioProp> = forwardRef(({ children }, ref) => {
  const [adSrc, setAdSrc] = useState('')
  const [show, setShow] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const changeOpenRadio = (data: any) => {
    let url = `https://alioss.gcores.com/uploads/audio/${data.included[0].attributes.audio}`
    curAudioData = data
    setAdSrc(url)
  }
  useImperativeHandle(ref, () => ({

  }))
  useEffect(() => {
    audioRef.current!.playbackRate = 2
    audioRef.current!.play()
  }, [adSrc])
  // useEffect(() => {
  //   const timer = setInterval(async () => {
  //     console.log(await readMemory())
  //   }, 1000)
  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [readMemory])
  return (
    <div className={'h-full w-full flex-col items-center justify-center pt-1 relative'} style={{ height: 'calc(100vh - 64px)' }} >
      <OpenRadio radioConfirm={changeOpenRadio} />
      {/* <img style={[]} src="https://miro.medium.com/max/1400/1*e_Loq49BI4WmN7o9ItTADg.gif" ></img> */}
      <div className={' '} style={{ height: 'calc(100% - 64px)' }}>

      </div>
      <div className={' self-end flex items-center justify-center'}>
        <audio ref={audioRef} src={adSrc} controls className={' w-5/6'}>
        </audio>

        {/* {
          adSrc ? (
            <audio ref={audioRef} src={adSrc} controls className={' w-5/6'}>
            </audio>
          ) : ""
        } */}
      </div>
    </div>
  )

})
export default withKeepAlive(memo(Radio));
// export default memo(Radio);