import MySkeleton from "components/MySkeleton";
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import { ShowRecordSizeList } from "services/nt";
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
  const [list, setList] = useState<string[][]>([[]])

  const getList = () => {
    setLoading(true)
    ShowRecordSizeList().then((res) => {
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
      <InfoList title={'Record 文件大小'} loading={loading} list={list} ></InfoList>
    </div>
  )

})

export default memo(RecordList);