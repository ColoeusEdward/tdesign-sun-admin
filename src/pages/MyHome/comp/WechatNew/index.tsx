import dayjs from "dayjs";
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { get_weather, get_wechat_new, wechatnewData } from "services/nt";
import { numToChinese, sleep } from "utils/util";

type IWechatNewProp = {
  children?: ReactNode
  name: string
}


const WechatNew: React.FC<IWechatNewProp> = forwardRef(({ children }, ref) => {
  const [newData, setNewData] = useState<wechatnewData[] | null>(null)
  const getNew = () => {
    get_wechat_new(40).then((res) => {
      setNewData(res)
    })
  }
  const goNewPage = (id: number) => {
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
    // <div className={'flex flex-wrap w-full h-full justify-center items-center p-2 overflow-y-auto'}  >
    <div className="w-full h-full">
      <MacScrollbar className={' w-full h-full '} style={{ overflow: 'auto' }} skin={'light'}>
        <div className="flex flex-wrap w-full h-fit justify-center items-center p-2">
          {newData && (
            <>
              {newData.map((item, index) => (
                <div key={index} className={'inline-block mr-2 px-2 bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 hover:border hover:border-solid  hover:border-neutral-600 border border-solid border-neutral-800 rounded-md py-2 w-[48%] overflow-hidden'} style={{ boxShadow: '0 4px 18px 0 rgb(0 0 0 / 25%)' }} onClick={() => { goNewPage(item.id) }} title={item.title.rendered}  >
                  <div className={'w-full text-ellipsis overflow-hidden whitespace-nowrap'}>{item.title.rendered}</div>
                </div>
              ))}
            </>
          )}

        </div>
      </MacScrollbar>
    </div>
    // </div>
  )

})

export default memo(WechatNew);