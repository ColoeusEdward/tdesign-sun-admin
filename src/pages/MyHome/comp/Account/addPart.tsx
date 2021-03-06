import classNames from "classnames";
import MySkeleton from "components/MySkeleton";;
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { get_account_list, LeftStorage, save_account_list, ShowRecordSizeList } from "services/nt";
import { Button, Card, Drawer, Form, FormRule, Input, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";
import InfoList from "../InfoList";
import { MdDelete } from "react-icons/md";
import { BsPlusSquareDotted } from "react-icons/bs";
import { AccData } from './index'
import FormItem from "tdesign-react/es/form/FormItem";
type IAddPartProp = {
  getList: Function
  children?: ReactNode
  // name: string
}

let formVal: AccData | {} = {}
const rules: FormRule[] = [{ required: true, message: '必填', type: 'error' },]
const AddPart: React.FC<IAddPartProp> = forwardRef(({ children,getList }, ref) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<AccData[]>([])
  const [drawShow, setDrawShow] = useState(false)
  const formRef = useRef<any>()
  const compClick = () => {

  }
  const formChange = (val: any, allVal: any) => {
    formVal = allVal
  }
  const submit = (e: any) => {
    formRef.current.validate()
      .then((res: any) => {if(res !== true) throw res; return res})
      .then(() => {
        setLoading(true)
        return save_account_list(formVal)
      })
      .then(() => {
        formRef.current?.reset()
      })
      .finally(() => {
        setLoading(false)
        hide()
        getList()
      })

  }
  useImperativeHandle(ref, () => ({
    compClick
  }))
  // useEffect(() => {

  // }, [])
  const showForm = () => {
    setDrawShow(true)
  }
  const renderBody = () => {
    return (
      <div className={'w-full h-full flex'}>
        <FormItem label="名字" name="acc" rules={rules}>
          <Input clearable />
        </FormItem>
        <FormItem label="密码" name="psw" rules={rules}>
          <Input clearable />
        </FormItem>
      </div>
    )
  }
  const hide = () => {
    setDrawShow(false)
  }

  return (
    <>
      <div className={'h-8 flex justify-center p-2'} onMouseUp={(e) => { e.stopPropagation() }} onTouchEnd={(e) => { e.stopPropagation() }}  >
        <Button className={'w-4/5 '} icon={<BsPlusSquareDotted className="text-2xl" />} shape={'round'} onClick={showForm} > </Button>
      </div>
      <div onMouseUp={(e) => { e.stopPropagation() }} onTouchEnd={(e) => { e.stopPropagation() }}>
        <Form ref={formRef} onSubmit={submit} labelWidth={60} layout={'inline'} onValuesChange={formChange} >
          <Drawer
            header={false}
            body={renderBody()}
            showInAttachedElement
            footer={
              <div className={'flex justify-center'}>
                <FormItem >
                  <Button className={'w-96'} type={'submit'} loading={loading} shape="round" >提 交</Button>
                </FormItem>
              </div>
            }
            visible={drawShow}
            onClose={hide}
            size={'130px'}
            placement={'bottom'}
            showOverlay={true}
          >
          </Drawer>
        </Form>
      </div>
    </>
  )

})

export default memo(AddPart);