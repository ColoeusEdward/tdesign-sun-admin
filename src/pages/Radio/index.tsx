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
import ScrollContainer from "react-indiana-drag-scroll";
import { BsArrowsFullscreen } from "react-icons/bs";

type IRadioProp = {
  children?: ReactNode
  name: string,

}
let curAudioData = null
const Radio: React.FC<IRadioProp> = forwardRef(({ children }, ref) => {
  const [adSrc, setAdSrc] = useState('')
  const [show, setShow] = useState(false)
  const [timeList, setTimeList] = useState<any[]>([])
  const [curTimeItem, setCurTimeItem] = useState<any>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isFull, setIsFull] = useState<boolean>(false)
  const changeOpenRadio = (data: any) => {
    let url = `https://alioss.gcores.com/uploads/audio/${data.included[0].attributes.audio}`
    curAudioData = data
    let tlist = data.included.filter((e: any) => e.type == 'timelines')
    setTimeList(tlist)
    setAdSrc(url)
    setCurTimeItem(tlist[0])
  }
  const jumpTime = (item: any) => {
    audioRef.current!.currentTime = item.attributes.at
    setCurTimeItem(item)
    // console.log("🚀 ~ file: index.tsx:35 ~ jumpTime ~ currentTime", audioRef.current!.currentTime)
  }
  const fullScreen = () => {
    setIsFull(true)
  }
  useImperativeHandle(ref, () => ({

  }))
  useEffect(() => {
    audioRef.current!.playbackRate = 2
    audioRef.current!.play()
  }, [adSrc])

  const buildTimeListDiv = () => {
    return timeList.map(e => {
      return (
        <div key={e.attributes.at} className={" w-10 h-32 inline-block bg-[#35363a]  pt-1 [writing-mode:vertical-lr] text-ellipsis overflow-hidden whitespace-nowrap hover:bg-slate-400 " + (curTimeItem.attributes.at == e.attributes.at ? 'bg-slate-600' : '')} onClick={() => { jumpTime(e) }} >
          {e.attributes.title}
        </div>
      )
    })
  }
  // useEffect(() => {
  //   const timer = setInterval(async () => {
  //     console.log(await readMemory())
  //   }, 1000)
  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [readMemory])
  return (
    <div className={'h-full w-full flex-col items-center justify-center pt-1 bg-[#181818] ' + (isFull ? 'absolute top-0 left-0 w-screen h-screen z-[250]' : 'relative')} style={{ height: !isFull ? 'calc(100vh - 64px)' : '100vh' }} >
      <OpenRadio radioConfirm={changeOpenRadio} />
      {!isFull && <Button className={'w-16 absolute top-2 left-2'} icon={<BsArrowsFullscreen className="text-2xl" />} shape={'round'} onClick={() => { fullScreen() }} > </Button>}
      {/* <img style={[]} src="https://miro.medium.com/max/1400/1*e_Loq49BI4WmN7o9ItTADg.gif" ></img> */}
      <div className={'flex flex-col justify-end items-center'} style={{ height: 'calc(100% - 64px)' }}>

        {curTimeItem && curTimeItem.attributes?.asset &&
          <div className={isFull ? ' max-w-full' : 'max-h-[600px]'}>
            <img src={`https://image.gcores.com/${curTimeItem.attributes.asset}`}  className={'w-full h-full object-contain'} />
          </div>
        }

        <div className={'h-40 text-center max-w-4xl text-lg mt-2 overflow-y-auto min-h-[100px]'}>
          {curTimeItem.attributes?.content}
        </div>
        {/* 时间轴 */}
        <div className={' justify-self-end w-full mb-2'}>
          <ScrollContainer className={'h-34 w-full overflow-hidden'}  >
            <div className={'inline-flex flex-nowrap overflow-y-hidden'}>
              {buildTimeListDiv()}
            </div>
          </ScrollContainer>
        </div>
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