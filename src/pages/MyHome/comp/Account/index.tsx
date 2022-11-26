import classNames from "classnames";
import MySkeleton from "components/MySkeleton";;
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { delete_accout, get_account_list, LeftStorage, ShowRecordSizeList } from "services/nt";
import { Button, Card, Popconfirm, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";
import InfoList from "../InfoList";
import { MdDelete, MdEdit } from "react-icons/md";
import { BsPlusSquareDotted } from "react-icons/bs";
import AddPart from "./addPart";

type IAccountProp = {
  clickFn?: Function
  children?: ReactNode
  name: string
}

export interface AccData {
  acc: string
  psw: string
}

const Account: React.FC<IAccountProp> = forwardRef(({ clickFn, children, name }, ref) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<AccData[]>([])
  const addPartRef = useRef<any>(null)
  const getList = () => {
    setLoading(true)
    get_account_list().then((res) => {
      setList(JSON.parse(res))
    }).finally(() => {
      setLoading(false)
    })
  }
  const deleteAcc = (e: AccData) => {
    delete_accout(e).then(res => {
      getList()
    })
  }
  const editAcc = (data: any) => {
    addPartRef.current!.edit(data)
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
    let l = list.map((e, i) => {
      return (
        <div onMouseUp={(e) => { e.stopPropagation() }} onTouchEnd={(e) => { e.stopPropagation() }} className={'px-2 py-1'} >
          <div className={classNames(' bg-zinc-800 active:bg-zinc-800 hover:border hover:border-solid  hover:border-neutral-600 border border-solid border-neutral-800 rounded-md w-full flex')} style={{
            boxShadow: '0 4px 18px 0 rgb(0 0 0 / 25%)'
          }}>
            <div className={'w-2/5 text-ellipsis overflow-hidden text-center border border-r-indigo-300 border-solid border-l-0 border-y-0 hover:bg-zinc-900 p-2 '} onClick={() => { copyToPaste(e.acc) }}>{e.acc}</div>
            <div className={'w-2/5 text-ellipsis overflow-hidden text-center hover:bg-zinc-900  p-2'} onClick={() => { copyToPaste(e.psw) }}>{e.psw}</div>
            <div className={'w-1/5 text-ellipsis overflow-hidden text-center  p-2'}>
              <Popconfirm content={'你确定?'} theme={'danger'} onConfirm={() => { deleteAcc(e) }}>
                <Button className={''} shape={'rectangle'} size={'small'} theme={'danger'} icon={<MdDelete className='text-lg' />} > </Button>
              </Popconfirm>
              <Button className={' ml-3'} onClick={() => { editAcc({ ...e, i }) }} shape={'rectangle'} size={'small'} theme={'default'} icon={<MdEdit className='text-lg' />} > </Button>
            </div>
          </div>
        </div>
      )
    })
    l.push(
      <AddPart getList={getList} ref={addPartRef} />
    )
    return l
  }
  return (
    <div className={'w-full h-full relative'} id={'account-draw-con'}>
      {children}
      <InfoList title={name} loading={loading} list={[]}>
        {renderList()}
      </InfoList>
    </div >
  )

})

export default memo(Account);