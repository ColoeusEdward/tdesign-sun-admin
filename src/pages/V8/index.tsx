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
import { menuClassName, sleep, toolBarRender, useToolBarRender } from "utils/util";
import ChangeBa from "./comp/ChangeBa";
import { useMouse } from "ahooks";
import { useAtom } from "jotai";
import { anchorPointAtom, mouseAtom } from "jtStore/home";
import PostMenu, { postMenuHandler } from "components/PostMenu/PostMenu";
import classNames from "classnames";
import { isFlipAtom } from "./jotai";
import Photo from "components/Photo";


type IVListProp = {
  rowClick: Function
  list: postData[]
  curUrlRef: React.MutableRefObject<string>
}
const innerHeight = window.innerHeight
let photoIdx = 0
const VList = memo(({ list, curUrlRef, rowClick }: IVListProp) => {
  const [isFlip] = useAtom(isFlipAtom)
  const tbRender = useToolBarRender()
  const photoFlip = () => {
    let list = document.getElementsByClassName('PhotoView__Photo')
    let photo = (photoIdx < list.length ? list[photoIdx] : list[list.length - 1]) as HTMLImageElement
    // console.log("🚀 ~ file: index.tsx:40 ~ photoFlip ~ photoIdx", photoIdx)
    if (photo) {
      let trsform = photo.style.transform
      let flipRotateList = [isFlip[0] && 'rotateY(180deg)', isFlip[1] && 'rotateX(180deg)']
      // console.log("🚀 ~ file: index.tsx ~ line 41 ~ photoFlip ~ flipRotateList", flipRotateList)
      !trsform && (photo.style.transform = flipRotateList.filter(e => e).join(' '))
      if (trsform) {
        let res = ''
        let rota = trsform.match(/(rotate\(\S+\))/)
        rota && (res = rota[0])
        res += flipRotateList.filter(e => e).join(' ')
        photo.style.transform = res
      }
    }
  }
  const renderRow = (item: postData,idx:number) => {
    const renderImgList = () => {
      // photoClassName={classNames({ 'flipX': isFlip[0], 'flipY': isFlip[1] })} 
      return (
        <PhotoProvider className={'select-none'} maskOpacity={0.5} speed={() => 300} toolbarRender={tbRender} portalContainer={document.getElementById('photoCon') || document.body} onIndexChange={(i) => { photoIdx = i }} onVisibleChange={(v, i) => { photoIdx = i }}  >
          <Space inline >
            {item.imgList?.map((item, index) => (
              <PhotoView key={index} src={item}  >
                <img src={item} onMouseDown={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation(); }} style={{ width: '50px' }} alt="" />
              </PhotoView>
            )) as ReactNode[]}
          </Space>
        </PhotoProvider>
      )
    }
    const renderAuthor = (author: any) => {
      return author.map((e: any,i:number) => {
        let obj: Record<string, Function> = {
          text: () => e.val
          , img: () => <img className={'relative top-0.5'} style={{ width: '16px' }} src={e.val} key={i} />
        }
        return obj[e.type] && obj[e.type]()
      })
    }

    return (
      <div className={'p-3 text-slate-400 hover:bg-neutral-900/60 bg-neutral-900 mx-4 my-4 rounded-lg'} style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }} onMouseDown={(e) => { curUrlRef.current = item.url; rowClick(e, item) }} key={idx} >
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
  useEffect(() => {
    photoFlip()
    // console.log("🚀 ~ file: index.tsx ~ line 91 ~ useEffect ~ (isFlip[0] || isFlip[1])", (isFlip[0] || isFlip[1]))
    // document.addEventListener('keydown', (e) => {
    //   if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].findIndex(item => item == e.key) > -1) {
    //     console.log("🚀 ~ file: index.tsx ~ line 107 ~ document.addEventListener ~ e.key", e.key)

    //   }
    // })
  }, [isFlip])

  // useEffect(() => {
  //   // photoFlip()
  //   // console.log("🚀 ~ file: index.tsx ~ line 91 ~ useEffect ~ (isFlip[0] || isFlip[1])", (isFlip[0] || isFlip[1]))
  //   document.addEventListener('keydown', (e) => {
  //     if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].findIndex(item => item == e.key) > -1) {
  //       console.log("🚀 ~ file: index.tsx ~ line 107 ~ document.addEventListener ~ e.key", e.key)

  //     }
  //   })
  // }, [])
  return (
    <>
      {list.map((e,i) => {
        return renderRow(e,i)
      })}
      <div id={'photoCon'}> </div>
    </>
  )
})

const RefreshBtn = memo(({ getData }: { getData: (e: any) => void }) => {
  // const { clientY } = useMouse()
  const [mouse] = useAtom(mouseAtom)
  const clientY = mouse?.clientY || 0
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
      <Button className={'w-14 h-14 text-5xl rounded-full '} onClick={getData} >
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
  const [curBa, setCurBa] = useState({ name: 'vtuber', fid: '26066262' })
  const postMenuRef = useRef<postMenuHandler>(null)

  console.log(`idx rerender`,);
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
    postMenuRef.current?.activeMenu(e)
  }
  const menuClick = useCallback((e: any) => {
    // console.log("🚀 ~ file: index.tsx ~ line 52 ~ menuClick ~ e", e)
    // toggleMenu(true)
    let obj: any = {
      jumpUrl: () => {
        window.open('https://tieba.baidu.com' + curUrlRef.current)
      }
    }
    obj[e.value] && obj[e.value]()

  }, [])

  useEffect(() => {
    getData()
  }, [curBa])


  return (
    <div className={'w-full h-full relative overflow-hidden bg-neutral-800 noPadDrawer'} id={'post-draw-container'} style={{ height: 'calc(100vh - 64px)' }}>
      <MySkeleton loading={loading} >
        <MacScrollbar className={'w-full h-full'} skin={'dark'} onContextMenu={handleContextMenu} >
          <VList rowClick={rowClick} list={dataList} curUrlRef={curUrlRef} />
          {/* {renderRefresh()} */}
          <Post curItem={curItem} ref={postRef} curBa={curBa} />
        </MacScrollbar>
      </MySkeleton>
      {/* {renderMenu()} */}
      <PostMenu ref={postMenuRef} menuClick={menuClick} >
        <MenuItem className={menuClassName} value={'jumpUrl'} >原文</MenuItem>
      </PostMenu>
      <ChangeBa ba={curBa} setBa={setCurBa} />
      <RefreshBtn getData={getData} />
    </div>
  )
}

export default withKeepAlive(memo(V8));