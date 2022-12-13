import { useMouse } from "ahooks";
import MyFormWrap, { IMyFormFormItem } from "components/MyFormWrap";
import { getMsgOpt } from "configs/cfg";
import { useAtom } from "jotai";
import { bookAtom } from "jtStore/book";
import { mouseAtom } from "jtStore/home";
import { FC, ForwardedRef, forwardRef, ForwardRefExoticComponent, memo, ReactNode, RefAttributes, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FaBook } from "react-icons/fa";
import { GrBook } from "react-icons/gr";
import { get_exist_book } from "services/nt";
import { Button, Drawer, Form, Input, InputNumber, Select, SelectValue, Textarea, TextareaValue, SubmitContext, TdFormProps, MessagePlugin } from "tdesign-react";
import FormItem from "tdesign-react/es/form/FormItem";
import Option from "tdesign-react/es/select/base/Option";
import { isLowResolution, mustRules } from "utils/util";

type IBookBottomProp = {
  // ba: { name: string, fid: string }
  // setBa: Function
}

const innerHeight = window.innerHeight
const BookBottom: FC<IBookBottomProp & RefAttributes<unknown>> = forwardRef(({ }, ref) => {
  // const bookDrawerRef = useRef<IBookDrawerHandle>(null)
  const bookDrawerRef = useRef<IBookDrawerHandle>(null)
  const mouse = useMouse()
  const [isPageClick, setIsPageClick] = useState(false)
  const [bookInfo, setBookInfo] = useAtom(bookAtom)
  const clientY = mouse.clientY || 1000
  const getYposi = () => {
    let yp = 0
    if(bookDrawerRef.current?.drawShow) return yp
    clientY > (innerHeight - 200) && (yp = 0)
    clientY <= (innerHeight - 200) && (yp = 210)
    return yp
  }
  const handleKeyUp = (val: string|number, { e }: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    console.log("🚀 ~ file: BookBottom.tsx ~ line 37 ~ handleKeyUp ~ e.key ", e.key )
    MessagePlugin.success({ content: e.key, ...getMsgOpt() })
    if (e.key != 'Enter') return
    window.$socket && window.$socket.emit('setPage', bookInfo.page)
  }

  useImperativeHandle(ref, () => ({

  }))
  useEffect(() => {
    if (clientY <= (innerHeight - 200) && isPageClick)
      setIsPageClick(false)
  }, [mouse])

  const content = isPageClick ? (
    <div className={'flex items-center'}>
      第<InputNumber style={{ width: '100px' }} theme={'normal'} className={'text-2xl'} value={bookInfo.page} onChange={(v) => {
        setBookInfo((pre) => {
          return Object.assign({}, pre, { page: v })
        })
      }} onKeyup={handleKeyUp} />页
    </div>
  ) : <p onClick={() => { setIsPageClick(true) }} >第{bookInfo.page}页</p>

  return (
    <div className={'w-full h-1/5 bg-zinc-800 flex justify-center bottom-0 items-center text-4xl absolute z-50'} id="bookBottomCon"
      style={{
        transition: 'transform 0.2s ease-in-out', transform: `translate3d(0px, ${getYposi()}px,0px)`
      }}>
      {content}
      <BookDrawer ref={bookDrawerRef} />
    </div>
  )
})

interface IBookDrawerProp {
  // drawShow: boolean
  // setDrawShow: React.Dispatch<React.SetStateAction<boolean>>
}
interface IBookDrawerHandle {
  drawShow: boolean
}

let formVal: { book: string } = { book: '' }

const BookDrawer: FC<IBookDrawerProp & RefAttributes<IBookDrawerHandle>> = memo(forwardRef(({ }, ref) => {
  const [drawShow, setDrawShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [itemList, setItemList] = useState<IMyFormFormItem[]>([
    { label: '当前书籍', prop: 'book', type: 'select', rules: mustRules, opt: [] },
  ])
  const submit = () => {
    window.$socket?.emit('changeBook', formVal.book)
    setDrawShow(false)
  }
  const hide = useCallback(() => {
    setDrawShow(false)
  }, [])
  const formChange: TdFormProps['onValuesChange'] = (val, allValues) => {
    console.log("🚀 ~ file: BookBottom.tsx ~ line 94 ~ formChange ~ allValues", allValues)
    formVal = allValues as { book: string }
  }

  const getBookOpt = () => {
    get_exist_book().then((res) => {
      setItemList((prev) => {
        let item = prev.find(e => e.prop == 'book')
        item!.opt = res.map(e => {
          return { label: e, value: e }
        })
        return prev.map(e => ({ ...e }))
      })
    })
  }
  useImperativeHandle(ref, () => ({
    drawShow
  }))
  useEffect(() => {
    if (drawShow) {
      getBookOpt()
    }
  }, [drawShow])
  return (
    <>
      <Button className={'absolute top-3 right-3  h-11  text-white'} theme="primary" variant="base" icon={<GrBook size={'32px'} fill="#fff" stroke="#fff" color="#fff" />} onClick={() => { setDrawShow(true) }}  ></Button>
      <Drawer
        header={false}
        body={
          <div className={'pt-10 text-lg'} onClick={(e) => {e.stopPropagation()}} onTouchEnd={(e) => {e.stopPropagation()}} >
            <MyFormWrap onValuesChange={formChange} onSubmit={submit} itemList={itemList} loading={loading} />
          </div>
        }
        showInAttachedElement
        footer={false}
        visible={drawShow}
        onClose={hide}
        size={'20%'}
        placement={'bottom'}
        showOverlay={true}
        attach={'#bookCon'}
      ></Drawer>
    </>
  )
}))

export default memo(BookBottom);