import { useSize } from "ahooks";
import { FC, memo, useEffect, useRef, useState } from "react";
import { Tooltip } from "tdesign-react";
import { sleep } from "utils/util";

export interface IIconProp {
  iconSrc: string
  name: string
}

const GridIcon: FC<IIconProp> = ({ iconSrc, name }) => {
  const conRef = useRef<HTMLDivElement>(null)
  const size = useSize(conRef)
  const sizeStyle = () => {
    let obj = size && size.width > 50 && { width: size.width + 'px', height: size.height + 'px' }
    return obj || { display: 'none' }
  }
  // const [wh, setWh] = useState<Record<string, number>>()
  return (
    <div className={'w-full h-full'} ref={conRef} >
      <Tooltip content={name} placement="bottom" showArrow >
        <div className={'w-full h-full flex justify-center items-center'} style={sizeStyle()}    >
          <img className="w-24 h-24 " src={iconSrc}></img>
        </div>
      </Tooltip>
    </div>
  )

}


export default memo(GridIcon);