import { useMouse } from "ahooks";
import { useAtom } from "jotai";
import { mouseAtom } from "jtStore/home";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { Button, Drawer, Select, SelectValue, Textarea, TextareaValue } from "tdesign-react";
import Option from "tdesign-react/es/select/base/Option";
import { isLowResolution } from "utils/util";

type IChangeBaProp = {
  ba: { name: string, fid: string }
  setBa: Function
}
type IChangeBtnProp = {
  setShow: Function
}
const baList = [{ name: 'v', fid: '97650' }, { name: 'bilibili', fid: '2265748' }, { name: 'vtuber', fid: '26066262' }, { name: '航空母舰', fid: '18940' }, { name: '真反二', fid: '27842763' }, { name: '核战避难所', fid: '17641967' }, { name: '极限竞速地平线5', fid: '24379958' }, { name: '2ch', fid: '839326' }, { name: 'switch交流', fid: '24424201' }]
const innerWidth = window.innerWidth
const ChangeBtn = memo(({ setShow }: IChangeBtnProp) => {
  const mouse = useMouse()
  const { clientX } = mouse
  const [, setMouse] = useAtom(mouseAtom)
  const getXposi = () => {
    let xp = 40
    clientX > (innerWidth - 300) && (xp = 0)
    clientX <= (innerWidth - 300) && (xp = 70)
    return xp
  }
  useEffect(() => {
    setMouse(mouse)
  },[mouse])
  return (
    <div className={'fixed -right-6 top-48'} style={{
      transition: 'transform 0.1s ease-in-out', transform: `translate3d(
    ${getXposi()}px,0px,0px)`
    }}>
      <Button shape="round" onClick={() => { setShow(true) }} icon={<FiChevronLeft className={'text-lg'} />} ><div className={'w-10'} ></div></Button>
    </div>
  )
})

const ChangeBa: FC<IChangeBaProp & RefAttributes<unknown>> = forwardRef(({ setBa, ba }, ref) => {
  const [drawShow, setDrawShow] = useState(false)
  const size = useMemo(() => isLowResolution() ? '90vw' : '300px', [])

  const baChange = (v: SelectValue) => {
    let item = baList.find((e: any) => e.fid == v)
    item && setBa(item)
  }
  const hide = useCallback(() => {
    setDrawShow(false)
  }, [])
  useImperativeHandle(ref, () => ({

  }))

  const renderBody = () => {
    return (
      <div className={'p-3'}>
        <Select value={ba.fid} onChange={baChange} >
          {baList.map(e => {
            return <Option key={e.fid} label={e.name} value={e.fid} />
          })}
        </Select>
      </div>
    )
  }
  return (
    <>
      <ChangeBtn setShow={setDrawShow} />
      <Drawer
        header={'切换'}
        body={renderBody()}
        footer={false}
        visible={drawShow}
        onClose={hide}
        size={size}
      >
      </Drawer>
    </>
  )

})

export default memo(ChangeBa);