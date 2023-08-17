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
    <div className={'flex w-full h-full justify-center items-center'} onClick={() => {window.open('https://www.msn.cn/zh-cn/weather/forecast/in-%E5%B9%BF%E4%B8%9C%E7%9C%81,%E4%B8%9C%E8%8E%9E%E5%B8%82?cvid=6c156bfa958d465cbd69b09d9026ff05&loc=eyJsIjoi5Lic6I6e5biCIiwiciI6IuW5v%2BS4nOecgSIsInIyIjoi5Lic6I6e5biCIiwiYyI6IuS4reWNjuS6uuawkeWFseWSjOWbvSIsImkiOiJDTiIsInQiOjEsImciOiJ6aC1jbiIsIngiOiIxMTMuNjg4MDAzNTQwMDM5MDYiLCJ5IjoiMjIuODI3OTk5MTE0OTkwMjM0In0%3D&weadegreetype=C')}} >
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