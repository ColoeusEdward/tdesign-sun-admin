import { useAtom } from "jotai";
import { memoryAtom } from "jtStore/home";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { backup_img, RmFile } from "services/nt";
import { FileImageIcon } from "tdesign-icons-react";
import { Button, Input, InputValue, Row, Textarea, TextareaValue } from "tdesign-react";
import TextareaToList from "../TextareaToList";
import ReactECharts from 'echarts-for-react';
import { sleep } from "utils/util";
import { useAtomCallback } from "jotai/utils";

type IMemChartProp = {
  children?: ReactNode
  name: string
}

const MemChart: React.FC<IMemChartProp> = forwardRef(({ children }, ref) => {

  const [memory] = useAtom(memoryAtom)
  const [show, setShow] = useState(false)
  const option = {
    title: {
      text: "内存用量",
      left: "center"
      , textStyle: {
        color: '#fff'
      }
    },
    // tooltip: {
    //   trigger: "item",
    //   formatter: "{a} <br/>{b} : {c} ({d}%)"
    // },
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    //   data: ["已用", "剩余"]
    // },
    color: ['#b03a5b', '#91cc75']
    , series: [
      {
        name: "Memory",
        type: "pie",
        radius: "80%",
        center: ["50%", "55%"],
        data: [
          { value: 10, name: "已用" },
          { value: 10, name: "剩余" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
        , label: {
          position: 'inner'
          , formatter: '{b}: {d}%'
          , fontSize: 14
        }
      }
    ]
  };

  useImperativeHandle(ref, () => ({

  }))
  const getOption = () => {
    option.series[0].data[0].value = memory[0]
    option.series[0].data[1].value = memory[1]
    return option
  }
  useEffect(() => {
    sleep(1000).then(() => {
      setShow(true)
    })
  }, [])
  // useEffect(() => {
  //   const timer = setInterval(async () => {
  //     console.log(await readMemory())
  //   }, 1000)
  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [readMemory])
  return (
    <div className={'h-full w-full flex-col items-center justify-center pt-1'}  >
      {show && <ReactECharts
        option={getOption()}
        style={{width:'280px',height:'230px'}}
      />}
    </div>
  )

})

export default memo(MemChart);