import { useSize } from "ahooks";
import classNames from "classnames";
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
  const tooltipRef = useRef<any>(null)
  
  const sizeStyle = () => {
    let obj = size && size.width > 50 && { width: size.width + 'px', height: size.height + 'px' }
    return obj || { display: 'none' }
  }
  const removePopup = () => {
    let popupDom = document.getElementsByClassName('t-popup t-popup--animation-enter-active t-popup--animation-enter-to appear-done enter-done')[0] as HTMLElement
    popupDom && (popupDom.style.display = 'none')  //部分解决popup闪烁问题, 果然是直接操作dom更实在
  }
  return (
    <div className={'w-full h-full hover:bg-neutral-700'} ref={conRef} onMouseDown={removePopup}>
      <Tooltip content={name} placement="bottom" showArrow ref={tooltipRef}>
        <div className={'w-full h-full flex justify-center items-center'} style={sizeStyle()}    >
          <img className="w-24 h-24 " src={iconSrc}></img>
        </div>
      </Tooltip>
    </div>
  )

}


export default memo(GridIcon);