import { useAtom } from "jotai";
import { memoryAtom } from "jtStore/home";
import { ElementType, forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { backup_img, get_radio_playlog, RmFile, save_radio_playlog } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue, Timeline, Tooltip, TooltipLite } from "tdesign-react";
import ReactECharts from 'echarts-for-react';
import { sleep } from "utils/util";
import { useAtomCallback } from "jotai/utils";
import withKeepAlive from "hooks/withKeepAlive";
import OpenRadio from "./OpenRadio";
import ScrollContainer from "react-indiana-drag-scroll";
import { BsArrowsFullscreen } from "react-icons/bs";
// import type {elem} from 'react-indiana-drag-scroll'

type IRadioProp = {
  children?: ReactNode
  name: string,

}
let wakeLock: any = null;
// const TimeLine = ({jumpTime,timeList}:{jumpTime:Function,timeList:any[]}) => {
//   return timeList.map(e => {
//     return (
//       <Tooltip key={e.attributes.at} placement="top" content={e.attributes.time}>
//         <div className={" w-10 h-32 inline-block bg-[#35363a]  pt-1 [writing-mode:vertical-lr] text-ellipsis overflow-hidden whitespace-nowrap hover:bg-slate-400 " + (curTimeItem.attributes.at == e.attributes.at ? 'bg-slate-600' : '')} onClick={() => { jumpTime(e) }} >
//           {e.attributes.title}
//         </div>
//       </Tooltip>
//     )
//   })
// }
const TimeLineItem = memo(({ e, jumpTime, isChoose }: { e: any, jumpTime: Function, isChoose?: boolean }) => {
  return (
    // <Tooltip placement="top" content={e.attributes.time}>
      <div className={" w-10 h-32 inline-block bg-[#35363a]  pt-1 [writing-mode:vertical-lr] text-ellipsis overflow-hidden whitespace-nowrap hover:bg-slate-400 " + (isChoose || false ? 'bg-slate-600' : '')} onClick={() => { jumpTime(e) }} title={e.attributes.time} >
        {e.attributes.title}
      </div>
    // </Tooltip>
  )
})
const Radio: React.FC<IRadioProp> = forwardRef(({ children }, ref) => {
  const [adSrc, setAdSrc] = useState('')
  const [timeList, setTimeList] = useState<any[]>([])
  const [curTimeItem, setCurTimeItem] = useState<any>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isFull, setIsFull] = useState<boolean>(false)
  const [curAudioData, setCurAudioData] = useState<any>({})
  const scrollConRef = useRef<any | null>(null)
  const [initReady, setInitReady] = useState<boolean>(false)
  const changeOpenRadio = useCallback((data: any) => {
    let url = `https://alioss.gcores.com/uploads/audio/${data.included[0].attributes.audio}`
    setCurAudioData(data)
    let tlist = data.included.filter((e: any) => e.type == 'timelines').sort((a: any, b: any) => {
      return a.attributes.at - b.attributes.at
    })
      .map((e: any, i: number) => {
        e.idx = i
        e.attributes.time = parseInt(e.attributes.at * 1 / 60 % 60 as unknown as string) + ":" + e.attributes.at * 1 % 60
        return e
      })
    // console.log("🚀 ~ file: index.tsx:37 ~ tlist ~ tlist", tlist)
    setAdSrc(url)
    if (tlist.length != 0) {
      setCurTimeItem(tlist[0])
      setTimeList(tlist)
    }
  }, [])
  const jumpTime = useCallback((item: any) => {
    audioRef.current!.currentTime = item.attributes.at
    setCurTimeItem(item)
  }, [])
  const fullScreen = () => {
    setIsFull(true)
  }
  const scrollToCenter = () => {
    // let divInstence = document.getElementsByClassName('indiana-scroll-container')[0]
    let width = scrollConRef.current!.clientWidth
    let lastDistence = scrollConRef.current!.scrollLeft
    // console.log("🚀 ~ file: index.tsx:53 ~ scrollToCenter ~ lastDistence", lastDistence)
    // console.log("🚀 ~ file: index.tsx:72 ~ scrollToCenter ~ width", width)
    let distence = (curTimeItem.idx * 1 + 1) * 40
    // console.log("🚀 ~ file: index.tsx:57 ~ scrollToCenter ~ distence", distence)
    if (distence > width / 2 && distence != lastDistence) {
      scrollConRef.current!.scrollLeft = distence - width / 2
    }
  }
  const requestWakeLock = async () => {
    if (wakeLock)
      return false
    try {
      wakeLock = await (navigator as any).wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released:', wakeLock.released);
        wakeLock = null
        return true
      });
      console.log('Screen Wake Lock released:', wakeLock.released);
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  useImperativeHandle(ref, () => ({

  }))
  useEffect(() => {
    if (!adSrc) return
    audioRef.current!.playbackRate = 1.75
    const getPlayLog = () => {
      get_radio_playlog(curAudioData.data.id).then(res => {
        if (Object.keys(res).length > 0) {
          audioRef.current!.currentTime = res.at
          if (timeList && timeList.length > 0) {
            let flist = timeList.filter(e => e.attributes.at > res.at)
            if (flist.length == 0) {
              flist[0] = { ...timeList[timeList.length - 1] }
              flist[0].idx++;
            }
            setCurTimeItem(timeList[flist[0].idx - 1])
          }
        }
        setInitReady(true)
        audioRef.current!.play()
      })
    }
    getPlayLog()
  }, [adSrc, curAudioData])

  useEffect(() => {
    if (!initReady) return
    if (timeList[0] && curTimeItem) {
      scrollToCenter()
    }
    const savePlaylog = () => {
      save_radio_playlog({ id: curAudioData.data.id, at: audioRef.current!.currentTime })
    }
    const doInterval = () => {
      if (timeList[0] && curTimeItem) {
        let nextItem = timeList[curTimeItem.idx + 1]
        if (nextItem && audioRef.current!.currentTime >= nextItem.attributes.at) {
          setCurTimeItem(nextItem)
        }
      }
      savePlaylog()
    }
    const interval = setInterval(() => {
      doInterval()
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [timeList, curTimeItem, initReady])
  useEffect(() => {
    requestWakeLock()
  }, [])
  const TimeListDiv = timeList.map(e => {
    let isChoose = (curTimeItem.attributes.at == e.attributes.at)
    return (
      <TimeLineItem key={e.attributes.at} e={e} jumpTime={jumpTime} isChoose={isChoose} />
    )
  })

  return (
    <div className={'h-full w-full flex-col items-center justify-center pt-1 bg-[#181818] ' + (isFull ? 'absolute top-0 left-0 w-screen h-screen z-[250]' : 'relative')} style={{ height: !isFull ? 'calc(100vh - 64px)' : '100vh' }} >

      <OpenRadio radioConfirm={changeOpenRadio} />
      {!isFull && <Button className={'w-16 absolute top-2 left-2'} icon={<BsArrowsFullscreen className="text-2xl" />} shape={'round'} onClick={() => { fullScreen() }} > </Button>}
      {/* <img style={[]} src="https://miro.medium.com/max/1400/1*e_Loq49BI4WmN7o9ItTADg.gif" ></img> */}
      <div className={'flex flex-col justify-end items-center'} style={{ height: 'calc(100% - 64px)' }}>

        {curTimeItem && curTimeItem.attributes && curTimeItem.attributes.asset &&
          (
            <div className={isFull ? ' max-w-full' : 'max-h-[600px]'}>
              <img src={`https://image.gcores.com/${curTimeItem.attributes.asset}`} className={'w-full h-full object-contain'} />
            </div>
          )
        }
        {
          (!curTimeItem || !curTimeItem.attributes) && <div> 暂无时间轴 </div>
        }

        <div className={'h-40 text-center max-w-4xl text-lg mt-2 overflow-y-auto min-h-[100px]'}>
          {curTimeItem && curTimeItem.attributes && curTimeItem.attributes.content}
        </div>
        {/* 时间轴 */}
        <div className={' justify-self-end w-full mb-2'}>
          <ScrollContainer className={'h-34 w-full'} ref={scrollConRef as any} >
            <div className={'inline-flex flex-nowrap overflow-y-hidden'}>
              {TimeListDiv}
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
export default withKeepAlive(Radio);
// export default memo(Radio);