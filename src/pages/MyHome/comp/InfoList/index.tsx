import MySkeleton from "components/MySkeleton";
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import { ShowRecordSizeList } from "services/nt";
import { Card, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";

type IInfoListProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
}

const InfoList: React.FC<IInfoListProp> = forwardRef(({ clickFn, children, name }, ref) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<string[][]>([[]])

  const getList = () => {
    setLoading(true)
    ShowRecordSizeList().then((res) => {
      console.log("🚀 ~ file: index.tsx ~ line 17 ~ ShowRecordSizeList ~ res", res)
      setList(res)
    }).finally(() => {
      setLoading(false)
    })
  }
  const compClick = () => {
    getList()
  }
  useImperativeHandle(ref, () => ({
    compClick
  }))
  // useEffect(() => {

  // }, [])

  const renderList = () => {
    return list.map(e => {
      return (
        <div onMouseUp={(e) => { e.stopPropagation() }} className={'flex  p-1'}>
          <div className={'flex items-center  py-1'} style={{ width: '10%' }}>
            <Tag theme="primary" variant="outline">{e[0]}</Tag>
          </div>
          <div className={'inline-block ml-2 px-2 bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 hover:border hover:border-solid  hover:border-neutral-600 border border-solid border-neutral-800 rounded-md py-2'} style={{
            width: '90%',
            boxShadow: '0 4px 18px 0 rgb(0 0 0 / 25%)'
          }}
            onClick={() => { copyToPaste(e[1]) }}
          >{e[1]}</div>
        </div>
      )
    })
  }

  return (
    <div className={'w-full h-full '}>
      {children}
      <MySkeleton loading={loading}>
        <MacScrollbar className={'w-full h-full p-3 relative flex-col'} style={{ overflow: 'auto' }} skin={'white'}>
          <div className={'mb-2 text-center  text-lg'}>Record 文件大小</div>
          {renderList()}
        </MacScrollbar>
      </MySkeleton>
    </div>
  )

})

export default memo(InfoList);