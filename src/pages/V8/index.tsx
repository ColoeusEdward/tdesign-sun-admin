import MySkeleton from "components/MySkeleton";
import withKeepAlive from "hooks/withKeepAlive";
import { MacScrollbar } from "mac-scrollbar";
import { ElementRef, memo, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { get_tb } from "services/nt";
import Style from './index.module.less'
import { postData } from 'types/index'
import { FaRegComments } from "react-icons/fa";
import Space from "components/Space";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { GiAnticlockwiseRotation, GiClockwiseRotation } from "react-icons/gi";
import { RiRefreshFill } from "react-icons/ri";
import { ControlledMenu, Menu, MenuItem, useMenuState } from "@szhsin/react-menu";
import { Button } from "tdesign-react";
import { CalendarIcon } from "tdesign-icons-react";
import Post from "./comp/Post";

const menuClassName = 'hover:bg-slate-800 bg-slate-700'

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
    setDataList([])
    setLoading(true)
    get_tb({ name: curBa.name }).then((res) => {
      console.log("🚀 ~ file: index.tsx ~ line 28 ~ get_tb ~ res", res)
      setDataList(res)
    }).finally(() => {
      setLoading(false)
    })
  }

  const rowClick = (e: any, item: postData) => {
    if (e.button == 0) {
      setCurItem(item)
      postRef.current?.show()
      // Detail.drawShow.value = true
      // Detail.getData()
    }
  }

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
    // getData()
  }, [curBa])

  const toolBarRender = ({ rotate, onRotate }: any): ReactNode => {
    return (
      <Space height="64px" align="center" >
        <GiAnticlockwiseRotation className={' text-2xl'} fill="#fff" onClick={() => { onRotate(rotate - 90) }} />
        <GiClockwiseRotation className={'text-2xl'} fill="#fff" onClick={() => { onRotate(rotate + 90) }} />
      </Space>
    )
  }
  const renderRow = (item: postData) => {
    const renderImgList = () => {
      return (
        <PhotoProvider className={'select-none'} maskOpacity={0.5} speed={() => 300} toolbarRender={toolBarRender} >
          <Space inline >
            {item.imgList?.map((item, index) => (
              <PhotoView key={index} src={item} >
                <img src={item} onMouseDown={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation(); }} style={{ width: '50px' }} alt="" />
              </PhotoView>
            ))}
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
      <div className={'p-3 text-slate-400 hover:bg-neutral-800/30 bg-neutral-900 mx-4 my-3 rounded-lg'} style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }} onMouseDown={(e) => { curUrlRef.current = item.url; rowClick(e, item) }} >
        <div className={'inline-block w-4/5 text-left'}>
          <div className={'text-base'}>{item.title}</div>
          <div className={'text-sm text-slate-500'}>{item.info}</div>
          {/* <div><Space>{renderImgList() || []}</Space></div> */}
          <div className={'inline-block'} onMouseDown={(e) => { e.stopPropagation() }} >{renderImgList()}</div>
        </div>
        <div className={'inline-block w-1/5 text-right'}>
          <div>{renderAuthor(item.author)}</div>
          <div>
            <div className={'text-sm text-slate-500 inline-block mr-3'}>{item.lastTime}</div>
            <div className={'inline-flex align-baseline items-center pt-1 '}>
              <FaRegComments className={'relative  mr-1'} fill="#fff" />
              {/* <NIcon style={{ height: '1ex' }}></NIcon> */}
              {item.replyNum}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderList = useCallback(() => {
    return dataList.map(e => {
      return renderRow(e)
    })
  }, [dataList])
  const renderMenu = () => {
    return (
      <ControlledMenu {...menuProps} anchorPoint={anchorPoint} menuClassName={'bg-slate-700 text-slate-300'} onClose={menuClose} onItemClick={menuClick} reposition={'initial'} position={'initial'} >
        <MenuItem className={menuClassName} value={'jumpUrl'} >原文</MenuItem>
      </ControlledMenu>
    )
  }
  const renderRefresh = () => {
    return (
      <div className={'fixed right-40 bottom-10'}>
        <Button className={'w-14 h-14 pt-1 text-5xl opacity-30 rounded-full '} shape={"circle"} onClick={() => { getData() }} >
          <RiRefreshFill />
        </Button>
      </div>
    )
  }


  return (
    <div className={'w-full h-full relative overflow-hidden'} style={{ height: 'calc(100vh - 64px)' }}>
      <MySkeleton loading={loading} >
        <MacScrollbar className={'w-full h-full'} skin={'dark'} onContextMenu={handleContextMenu} >
          {renderList()}
          {renderRefresh()}
          <Post curItem={curItem} ref={postRef} />
        </MacScrollbar>
      </MySkeleton>
      {renderMenu()}
    </div>
  )
}

export default withKeepAlive(memo(V8));