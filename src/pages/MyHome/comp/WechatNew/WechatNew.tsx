import dayjs from "dayjs";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { get_weather,get_wechat_new,wechatnewData } from "services/nt";
import { numToChinese, sleep } from "utils/util";

type IWechatNewProp = {
  children?: ReactNode
  name: string
}


const WechatNew: React.FC<IWechatNewProp> = forwardRef(({ children }, ref) => {
  const [newData, setNewData] = useState<wechatnewData[] | null>(null)
  const getNew = () => {
    
  }
  const goNewPage = (id:number) => {
    window.open(`https://redian.news/wxnews/${id}`)
  }

  const loopGet = async () => {
    while (true) {
      getNew()
      await sleep(600000)
    }
  }
  useEffect(() => {
    loopGet()
  }, [])
  return (
    <div className={'flex w-full h-full justify-center items-center'}  >
      {newData && (
        <>
          
        </>
      )}
    </div>
  )

})

