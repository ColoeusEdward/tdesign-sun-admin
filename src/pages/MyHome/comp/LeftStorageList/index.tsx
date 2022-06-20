import MySkeleton from "components/MySkeleton";
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import { LeftStorage, ShowRecordSizeList } from "services/nt";
import { Card, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";
import InfoList from "../InfoList";

type IRecordListProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
}

const RecordList: React.FC<IRecordListProp> = forwardRef(({ clickFn, children, name }, ref) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<string[]>([])

  const getList = () => {
    setLoading(true)
    LeftStorage().then((res) => {
      // console.log("🚀 ~ file: index.tsx ~ line 22 ~ LeftStorage ~ res", res)
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

  return (
    <div className={'w-full h-full '}>
      {children}
      <InfoList title={'剩余空间'} loading={loading} list={list} highLightLineIdx={3} ></InfoList>
    </div>
  )

})

export default memo(RecordList);