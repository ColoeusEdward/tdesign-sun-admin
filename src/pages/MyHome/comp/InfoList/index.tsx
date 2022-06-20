import classNames from "classnames";
import MySkeleton from "components/MySkeleton";
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import { ShowRecordSizeList } from "services/nt";
import { Card, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";

type IInfoListProp = {
  list: any[] | any[][]
  children?: ReactNode
  title: string
  loading: boolean
  highLightLineIdx?: number
}

const InfoList: React.FC<IInfoListProp> = ({ list, loading, title, highLightLineIdx }) => {
  // const [list, setList] = useState<string[][]>([[]])


  const renderList = () => {
    return list.map((e, i) => {
      return (
        <div onMouseUp={(e) => { e.stopPropagation() }} className={'flex  p-1'} >
          {e.length == 2 &&
            <div className={'flex items-center  py-1'} style={{ width: '10%' }}>
              <Tag theme="primary" variant="outline">{e[0]}</Tag>
            </div>
          }
          <div className={classNames('inline-block ml-2 px-2 bg-zinc-800 hover:bg-zinc-900 active:bg-zinc-800 hover:border hover:border-solid  hover:border-neutral-600 border border-solid border-neutral-800 rounded-md py-2 ', { 'text-orange-500': highLightLineIdx == i })} style={{
            width: e.length == 2 ? '90%' : '100%',
            boxShadow: '0 4px 18px 0 rgb(0 0 0 / 25%)'
          }}
            onClick={() => { copyToPaste(e[1]) }}
          >{e.length == 2 ? e[1] : e}</div>
        </div>
      )
    })
  }

  return (
    <div className={'w-full h-full '}>
      <MySkeleton loading={loading}>
        <MacScrollbar className={'w-full h-full p-3 relative flex-col'} style={{ overflow: 'auto' }} skin={'white'}>
          <div className={'mb-2 text-center  text-lg'}>{title}</div>
          {renderList()}
        </MacScrollbar>
      </MySkeleton>
    </div>
  )

}

export default memo(InfoList);