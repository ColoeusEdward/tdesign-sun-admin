import classNames from "classnames";
import MySkeleton from "components/MySkeleton";;
import { MacScrollbar } from "mac-scrollbar";
import { forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useRef, useState, RefAttributes, useMemo } from "react";
import { edit_accountList, get_account_list, get_gradio, get_gradio_info, get_gradio_info_simple, get_last_radio_playlog, LeftStorage, playLog, SaveGadioAndUpKey, save_account_list, ShowRecordSizeList } from "services/nt";
import { Button, Card, Drawer, Dropdown, Form, FormRule, Input, MessagePlugin, NotificationPlugin, Select, Switch, Tag, TdDropdownProps } from "tdesign-react";
import { ajaxPromiseAll, copyToPaste, sleep } from "utils/util";
import { BsArrowsFullscreen, BsPlusSquareDotted } from "react-icons/bs";
import FormItem from "tdesign-react/es/form/FormItem";
import { BiLastPage } from "react-icons/bi";
import { RiDownloadCloudFill } from "react-icons/ri";
import { getMsgOpt } from "configs/cfg";
import { useAtom } from "jotai";
import { radioFastInitCountAtom } from "jtStore/home";
type IOpenRadioProp = {
  children?: ReactNode,
  radioConfirm: (info: any, isUpKey: boolean) => void,
  // name: string
}

let originData: string & { i: number }
let formVal: string
const rules: FormRule[] = []
let isEdit = false
const OpenRadio: React.FC<IOpenRadioProp & RefAttributes<unknown>> = forwardRef(({ radioConfirm }, ref) => {
  const [loading, setLoading] = useState(false)
  const [lastLoading, setLastLoading] = useState(false)
  const [cacheLoading, setCacheLoading] = useState(false)
  const [drawShow, setDrawShow] = useState(false)
  const [radioList, setRadioList] = useState([{ label: '', value: '' }]);
  const [curRadio, setCurRadio] = useState<number | string>('')
  const [isUpKey, setIsUpKey] = useState<boolean>(true)
  const [fastInitCount] = useAtom(radioFastInitCountAtom)
  const [getRadioLoading, setGetRadioLoading] = useState(false)
  const formRef = useRef<any>()

  const options = [
    {
      content: '定位最新并跳转',
      value: 0,
    },
    {
      content: '定位最新',
      value: 1,
    },
  ];
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
      radioConfirm(res, isUpKey)
      autoCacheNextRadio(curRadio)
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
    setGetRadioLoading(true)
    return get_gradio().then(e => {
      setRadioList(e)
      return new Promise((resolve, reject) => {
        resolve(e)
      })
    }).finally(() => {
      setGetRadioLoading(false)
    })

  }
  const selectLastRadio = () => {
    setLastLoading(true)
    let tempCurRadio: string | number = ''
    ajaxPromiseAll<[any,playLog]>([getRadioList(),get_last_radio_playlog()])
    .then(([,e])=> {
      setCurRadio(e.id)
      tempCurRadio = e.id
      return get_gradio_info(e.id)
    }).then(res => {
      radioConfirm(res, isUpKey)
      // autoCacheNextRadio(tempCurRadio)
      setDrawShow(false)
    }).finally(() => {
      setLastLoading(false)
    })
  }

  const autoCacheNextRadio = (tempCurRadio: string | number) => {
    let nextIdx = radioList.findIndex(e => e.value == tempCurRadio)
    // console.log("🚀 ~ file: OpenRadio.tsx:120 ~ autoCacheNextRadio ~ nextIdx:", nextIdx)
    if (nextIdx - 1 < 0) {
      return
    }
    let next = radioList[nextIdx - 1]
    get_gradio_info_simple(next.value).then((data: any) => {
      console.log("🚀 ~ file: OpenRadio.tsx:125 ~ get_gradio_info_simple ~ data:", data)
      let url = `https://alioss.gcores.com/uploads/audio/${data.included[0].attributes.audio}`
      return SaveGadioAndUpKey(url,data.data.attributes.title)
    })
  }

  const cacheCurRadioFile = () => {
    if (!curRadio) {
      MessagePlugin.warning({ content: '请先选择一条数据', ...getMsgOpt() })
      return
    }
    setCacheLoading(true)
    get_gradio_info_simple(curRadio).then((data: any) => {
      let url = `https://alioss.gcores.com/uploads/audio/${data.included[0].attributes.audio}`
      return SaveGadioAndUpKey(url,data.data.attributes.title)
    }).then(() => {

    }).finally(() => {
      setCacheLoading(false)
    })


  }

  useImperativeHandle(ref, () => ({
    compClick,
    edit
  }))
  // useEffect(() => {
  //   console.log(`curRadio`, curRadio);
  // }, [curRadio])
  // useEffect(() => {
  //   setCurRadio('168044')
  // }, [radioList])
  const showForm = () => {
    setDrawShow(true)
    getRadioList()
  }

  const radioChange = (val: any) => {
    setCurRadio(val)
  }
  const rightDropDownClick: TdDropdownProps['onClick'] = (data) => {
    let v = data.value as number
    let fn = [
      () => { selectLastRadio() },
      () => {
        setLastLoading(true)
        get_last_radio_playlog().then(e => {
          setCurRadio(e.id)
        }).finally(() => {
          setLastLoading(false)
        })
      },
    ]
    fn[v] && fn[v]()
  }
  // https://alioss.gcores.com/uploads/audio/18102b7a-2d8a-49e9-b1aa-5c04d2ce1a64.mp3
  // const renderBody = () => {
  //   return (
  //     <div className={'w-full h-full flex'}>
  //       <FormItem label="电台" className={'w-full'} >
  //         <Select onChange={radioChange} value={curRadio} options={radioList} clearable />
  //       </FormItem>
  //     </div>
  //   )
  // }

  const body2 = (
    <div className={'w-full h-full flex items-center'}>
      <span className=" w-10 align-middle ">电台  </span> <Select onChange={radioChange} value={curRadio ? String(curRadio) : ''} options={radioList} clearable />
    </div>
  )
  const hide = () => {
    setDrawShow(false)

  }

  useEffect(() => {
    console.log("🚀 ~ file: OpenRadio.tsx:197 ~ constOpenRadio:React.FC<IOpenRadioProp&RefAttributes<unknown>>=forwardRef ~ fastInitCount:", fastInitCount)
    if (fastInitCount > 0) {
      MessagePlugin.success({ content: '电台快速触发', ...getMsgOpt() })
      rightDropDownClick({ value: 0 }, {} as any)
    }
  }, [fastInitCount])
  useEffect(() => {
    autoCacheNextRadio(curRadio)
  },[curRadio])
  // useEffect(() => {
  //   getRadioList()
  // }, [])
  // useEffect(() => {
  //   NotificationPlugin.success({ title:'Gradio OK',duration:10000,content:'机核下载处理成功',closeBtn:true })
  // },[])

  return (
    <>
      <div className={'h-8 flex justify-center p-2 absolute right-2 top-2 '} style={{zIndex:'500'}}
      // onMouseUp={(e) => { e.stopPropagation() }} onTouchEnd={(e) => { e.stopPropagation() }}  
      >
        <Button className={'w-16 '} icon={<BsPlusSquareDotted className="text-2xl" />} shape={'round'} accessKey="c" onClick={() => { isEdit = false; showForm() }} > </Button>
      </div>
      <div >
        <Form ref={formRef} labelWidth={60} layout={'inline'} onValuesChange={formChange}
        // onSubmit={submit}
        >
          <Drawer
            header={false}
            body={body2}
            showInAttachedElement
            footer={
              <div className={'flex justify-center'}>
                <div className=" absolute left-2 ">
                  <Button icon={<RiDownloadCloudFill className="text-2xl" />} onClick={cacheCurRadioFile} loading={cacheLoading} ></Button>
                </div>

                <Button className={' min-w-[10rem] max-w-[24rem]'} onClick={submit} type={'submit'} loading={loading} shape="round" >提 交</Button>

                <div className=" absolute right-2 ">
                  <Switch value={isUpKey} className={'mr-2'} size={'large'} onChange={(val) => { setIsUpKey(val) }}  ></Switch>
                  <Dropdown onClick={rightDropDownClick} options={options} trigger={'click'} >
                    <Button icon={<BiLastPage className="text-2xl" />} loading={lastLoading} ></Button>
                  </Dropdown>
                </div>

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