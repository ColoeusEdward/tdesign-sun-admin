import MySkeleton from "components/MySkeleton";
import withKeepAlive from "hooks/withKeepAlive";
import { MacScrollbar } from "mac-scrollbar";
import { ElementRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { get_tb } from "services/nt";
import Style from './index.module.less'
import { postData } from 'types/index'
import { FaRegComments } from "react-icons/fa";
import Space from "components/Space";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { RiRefreshFill } from "react-icons/ri";
import { ControlledMenu, Menu, MenuItem, useMenuState } from "@szhsin/react-menu";
import { Button } from "tdesign-react";
import { CalendarIcon } from "tdesign-icons-react";
import Post from "./comp/Post";
import { sleep, toolBarRender } from "utils/util";
import ChangeBa from "./comp/ChangeBa";
import { useMouse } from "ahooks";
const menuClassName = 'hover:bg-slate-800 bg-slate-700'

type IVListProp = {
  rowClick: Function
  list: postData[]
  curUrlRef: React.MutableRefObject<string>
}
const innerHeight = window.innerHeight
const VList = memo(({ list, curUrlRef, rowClick }: IVListProp) => {
  const renderRow = (item: postData) => {
    const renderImgList = () => {
      return (
        <PhotoProvider className={'select-none'} maskOpacity={0.5} speed={() => 300} toolbarRender={toolBarRender} >
          <Space inline >
            {item.imgList?.map((item, index) => (
              <PhotoView key={index} src={item} >
                <img src={item} onMouseDown={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation(); }} style={{ width: '50px' }} alt="" />
              </PhotoView>
            )) as ReactNode[]}
          </Space>
        </PhotoProvider>
      )
    }
    const renderAuthor = (author: any) => {
      return author.map((e: any) => {
        let obj: Record<string, Function> = {
          text: () => e.val
          , img: () => <img className={'relative top-0.5'} style={{ width: '16px' }} src={e.val} />
        }
        return obj[e.type] && obj[e.type]()
      })
    }

    return (
      <div className={'p-3 text-slate-400 hover:bg-neutral-900/60 bg-neutral-900 mx-4 my-4 rounded-lg'} style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }} onMouseDown={(e) => { curUrlRef.current = item.url; rowClick(e, item) }} >
        <div className={'inline-block w-4/5 text-left'}>
          <div className={'text-base'}>{item.title}</div>
          <div className={'text-sm text-slate-500'}>{item.info}</div>
          {/* <div><Space>{renderImgList() || []}</Space></div> */}
          <div className={'inline-block'} onMouseDown={(e) => { e.stopPropagation() }} >{renderImgList()}</div>
        </div>
        <div className={'inline-block w-1/5 text-right'}>
          <div>{renderAuthor(item.author)}</div>
          <div className="p-1" >
            <div className={'text-sm align-middle text-slate-500 inline-block mr-3'}>{item.lastTime}</div>
            <div className={'inline-flex align-middle items-center'}>
              <FaRegComments className={'relative  mr-1'} fill="#fff" />
              {/* <NIcon style={{ height: '1ex' }}></NIcon> */}
              {item.replyNum}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {list.map(e => {
        return renderRow(e)
      })}
    </>
  )
})

const RefreshBtn = memo(({ getData }: { getData: (e: any) => void }) => {
  const { clientY } = useMouse()
  const getYposi = () => {
    let yp = 100
    clientY > (innerHeight - 200) && (yp = 0)
    clientY <= (innerHeight - 200) && (yp = 100)
    return yp
  }
  return (
    <div className={'fixed right-40 bottom-10'}
      style={{
        transition: 'transform 0.2s ease-in-out', transform: `translate3d(0px, ${getYposi()}px,0px)`
      }}>
      <Button className={'w-14 h-14 pt-1 text-5xl rounded-full '} onClick={getData} >
        <RiRefreshFill />
      </Button>
    </div>
  )
})

const V8: React.FC = () => {
  const curUrlRef = useRef('')
  const postRef = useRef<ElementRef<typeof Post>>(null)
  const [curItem, setCurItem] = useState<postData>()
  // const curItem = useRef<postData>()
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState<postData[]>([])
  const [curBa, setCurBa] = useState({ name: "v", fid: '97650' })
  const [menuProps, toggleMenu] = useMenuState({ unmountOnClose: false, transition: true })
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const getData = () => {
    setLoading(true)
    setCurItem(undefined)
    sleep(50).then(() => {
      setDataList([])
    })
    get_tb({ name: curBa.name }).then((res) => {
      // console.log("🚀 ~ file: index.tsx ~ line 28 ~ get_tb ~ res", res)
      setDataList(res)
    }).finally(() => {
      setLoading(false)
    })
  }

  const rowClick = useCallback((e: any, item: postData) => {
    if (e.button == 0) {
      setCurItem(item)
      postRef.current?.show()
      // Detail.drawShow.value = true
      // Detail.getData()
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true)
  }
  const menuClick = useCallback((e: any) => {
    // console.log("🚀 ~ file: index.tsx ~ line 52 ~ menuClick ~ e", e)
    toggleMenu(true)
    let obj: any = {
      jumpUrl: () => {
        window.open('https://tieba.baidu.com' + curUrlRef.current)
      }
    }
    obj[e.value] && obj[e.value]()

  }, [])

  const menuClose = useCallback(() => {
    toggleMenu(false)
  }, [])
  useEffect(() => {
    getData()
  }, [curBa])

  const renderMenu = () => {
    return (
      <ControlledMenu {...menuProps} anchorPoint={anchorPoint} menuClassName={'bg-slate-700 text-slate-300'} onClose={menuClose} onItemClick={menuClick} reposition={'initial'} position={'initial'} >
        <MenuItem className={menuClassName} value={'jumpUrl'} >原文</MenuItem>
      </ControlledMenu>
    )
  }

  return (
    <div className={'w-full h-full relative overflow-hidden bg-neutral-800 noPadDrawer'} style={{ height: 'calc(100vh - 64px)' }}>
      <MySkeleton loading={loading} >
        <MacScrollbar className={'w-full h-full'} skin={'dark'} onContextMenu={handleContextMenu} >
          <VList rowClick={rowClick} list={dataList} curUrlRef={curUrlRef} />
          {/* {renderRefresh()} */}
          <Post curItem={curItem} ref={postRef} curBa={curBa} />
        </MacScrollbar>
      </MySkeleton>
      {renderMenu()}
      <ChangeBa ba={curBa} setBa={setCurBa} />
      <RefreshBtn getData={getData} />
    </div>
  )
}

export default withKeepAlive(memo(V8));