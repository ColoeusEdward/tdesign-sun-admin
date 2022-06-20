import dayjs from "dayjs";
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { get_weather } from "services/nt";
import { numToChinese, sleep } from "utils/util";

type IWeatherProp = {
  children?: ReactNode
  name: string
}
type weatherData = {
  city: string
  , lunar: string
  , date: string
  , temp: string
  , week: string
}

const Weather: React.FC<IWeatherProp> = forwardRef(({ children }, ref) => {
  const [weatherData, setWeatherData] = useState<weatherData | null>(null)
  const getWeather = () => {
    get_weather().then((resData: any) => {
      let day = dayjs().format(`d`)
      let data = {
        city: resData.cityNameWithSuffix
        , lunar: resData.nongli
        , date: dayjs().format(`MM月DD号`)
        , temp: `${resData.day1.tempLow}℃~${resData.day1.tempHigh}℃ ${resData.day1.weather}`
        , week: `星期` + numToChinese(Number(day))
      }
      setWeatherData(data)
    })
  }

  const loopGet = async () => {
    while (true) {
      getWeather()
      await sleep(600000)
    }
  }
  useEffect(() => {
    loopGet()
  }, [])
  return (
    <div className={'flex w-full h-full justify-center items-center'}  >
      {weatherData && (
        <>
          <div className={'flex flex-auto h-full w-1/4 justify-center items-start flex-col py-3 pl-3 space-y-4'} >
            <span>{weatherData.city}</span>
            <span className={'text-base font-bold'} >{weatherData.week}</span>
          </div>
          <div className={'flex flex-auto  h-full w-3/4 justify-center items-end flex-col py-3 pr-3 space-y-4'} >
            <span>{weatherData.date + ' ' + weatherData.lunar}</span>
            <span className={'text-base'}>{weatherData.temp}</span>
          </div>
        </>
      )}
    </div>
  )

})

export default memo(Weather);