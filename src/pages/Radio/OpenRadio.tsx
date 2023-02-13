import classNames from "classnames";
import MySkeleton from "components/MySkeleton";;
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useRef, useState, RefAttributes } from "react";
import { edit_accountList, get_account_list, get_gradio, get_gradio_info, LeftStorage, save_account_list, ShowRecordSizeList } from "services/nt";
import { Button, Card, Drawer, Form, FormRule, Input, Select, Tag } from "tdesign-react";
import { copyToPaste } from "utils/util";
import { BsArrowsFullscreen, BsPlusSquareDotted } from "react-icons/bs";
import FormItem from "tdesign-react/es/form/FormItem";
type IOpenRadioProp = {
  children?: ReactNode,
  radioConfirm: (info: any) => void,
  // name: string
}

let originData: string & { i: number }
let formVal: string
const rules: FormRule[] = []
let isEdit = false
const OpenRadio: React.FC<IOpenRadioProp & RefAttributes<unknown>> = forwardRef(({ radioConfirm }, ref) => {
  const [loading, setLoading] = useState(false)
  const [drawShow, setDrawShow] = useState(false)
  const [radioList, setRadioList] = useState([{ label: '', Id: '' }]);
  const [curRadio, setCurRadio] = useState<string>()
  const formRef = useRef<any>()
  const compClick = () => {

  }
  const edit = (data: string & { i: number }) => {
    formVal = data
    originData = data
    formRef.current.setFieldsValue(data)
    isEdit = true
    showForm()
  }
  const formChange = (val: any, allVal: any) => {
    formVal = allVal
  }
  const submit = (e: any) => {
    // console.log(`curra`,curRadio);
    if (!curRadio) return
    get_gradio_info(curRadio).then(res => {
      radioConfirm(res)
    })
    setDrawShow(false)
    // formRef.current.validate()
    //   .then((res: any) => { if (res !== true) throw res; return res })
    //   .then(() => {
    //     setLoading(true)
    //     if (isEdit) {
    //       return edit_accountList({ ...formVal, i: originData.i })
    //     } else {
    //       return save_account_list(formVal)
    //     }

    //   })
    //   .then(() => {
    //     formRef.current?.reset()
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //     hide()
    //     getList()
    //   })

  }
  const getRadioList = () => {
    get_gradio().then(e => {
      setRadioList(e)
    })
  }
  
  useImperativeHandle(ref, () => ({
    compClick,
    edit
  }))
  // useEffect(() => {

  // }, [])
  const showForm = () => {
    setDrawShow(true)
    getRadioList()
  }

  const radioChange = (val: any) => {
    setCurRadio(val as string)
  }
  // https://alioss.gcores.com/uploads/audio/18102b7a-2d8a-49e9-b1aa-5c04d2ce1a64.mp3
  const renderBody = () => {
    return (
      <div className={'w-full h-full flex'}>
        <FormItem label="电台" className={'w-full'} >
          <Select onChange={radioChange} value={curRadio} options={radioList} clearable />
        </FormItem>
      </div>
    )
  }
  const hide = () => {
    setDrawShow(false)
  }

  return (
    <>
      <div className={'h-8 flex justify-center p-2 absolute right-2 top-2 '}
      // onMouseUp={(e) => { e.stopPropagation() }} onTouchEnd={(e) => { e.stopPropagation() }}  
      >
        <Button className={'w-16 '} icon={<BsPlusSquareDotted className="text-2xl" />} shape={'round'} onClick={() => { isEdit = false; showForm() }} > </Button>
      </div>
      <div >
        <Form ref={formRef} labelWidth={60} layout={'inline'} onValuesChange={formChange}
        // onSubmit={submit}
        >
          <Drawer
            header={false}
            body={renderBody()}
            showInAttachedElement
            footer={
              <div className={'flex justify-center'}>
                <FormItem className={'mb-0'} style={{ margin: 0 }}>
                  <Button className={'w-96'} onClick={submit} type={'submit'} loading={loading} shape="round" >提 交</Button>
                </FormItem>
              </div>
            }
            visible={drawShow}
            onClose={hide}
            size={'130px'}
            placement={'bottom'}
            showOverlay={true}
            closeBtn={false}
            attach={document.querySelector('#account-draw-con') as any}
          >
          </Drawer>
        </Form>
      </div>
    </>
  )

})

export default memo(OpenRadio);