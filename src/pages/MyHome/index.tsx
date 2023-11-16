import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, MessagePlugin } from 'tdesign-react';
import { CheckCircleIcon } from 'tdesign-icons-react';
import { useParams } from 'react-router-dom';
import withKeepAlive from 'hooks/withKeepAlive';
import GridLayout, { WidthProvider } from "react-grid-layout";
import { useAtom } from 'jotai';
import { clickTimeAtom } from 'jtStore/home';
import { gridItem } from 'types';
import { getNewSize, randomStickerColor } from './itemSizeConfig';
import { isLowResolution, sleep } from 'utils/util';
import { FC } from 'react';
import { isEqual } from 'lodash';
import LinkBtn from './comp/LinkBtn';
import GridIcon from './comp/GridIcon';
import classNames from 'classnames';
import Style from './index.module.less'
import DeleteFile from './comp/DeleteFile';
import FreeCloudUpload from './comp/FreeCloudUpload';
import { getMsgOpt } from 'configs/cfg';
import MySkeleton from 'components/MySkeleton';
import RecordList from './comp/RecordList';
import LeftStorageList from './comp/LeftStorageList';
import FlvToMp4 from './comp/FlvToMp4';
import BackupImg from './comp/BackupImg';
import MemChart from './comp/MemChart';
import Weather from './comp/Weather';
import { useSize } from 'ahooks';
import Account from './comp/Account';
import GoogleImg from './comp/GoogleImg';
import { useImmer } from 'use-immer';
import produce from 'immer';
import SyncToYou from './comp/SyncToYou';
import SaImg from './comp/SaImg';
import WechatNew from './comp/WechatNew';
import WgetToRecord from './comp/WgetToRecord';
import NpmJump from './comp/NpmJump';
import PixivNum from './comp/PixivNum';
// import Radio from './comp/Radio';

const originLayout = [
  { type: 'btn', Comp: LinkBtn, ref: null, clickFn: 'recoverLayout', name: '复原', x: 11, y: 0, iconSrc: 'https://img.icons8.com/office/96/undefined/synchronize.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放式上传', x: 0, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/upgrade.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放MP4', x: 1, y: 0, iconSrc: 'https://img.icons8.com/color/100/000000/video.png' },
  { type: 'btn', Comp: LinkBtn, name: '命令行', x: 4, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/command-line.png' },
  { type: 'btn', Comp: LinkBtn, name: 'aria2', x: 5, y: 0, iconSrc: 'https://img.icons8.com/color/96/undefined/launched-rocket--v1.png' },
  { type: 'uploadBtn', Comp: LinkBtn, name: '部署', x: 10, y: 0, iconSrc: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/deployment-2369058-1978336.png' },
  { type: '2x3', Comp: DeleteFile, name: '删除文件', x: 2, y: 0, iconSrc: 'https://img.icons8.com/color/96/null/delete-forever.png' },
  { type: '2x3', Comp: FreeCloudUpload, name: '自由上传文件', x: 7, y: 6, iconSrc: 'https://img.icons8.com/bubbles/100/000000/upload.png' },
  { type: '2x3', Comp: SyncToYou, name: '上传视频至youtube', x: 6, y: 0, iconSrc: 'https://img.icons8.com/fluency/96/000000/youtube-play.png' },
  { type: '2x4', Comp: RecordList, name: '查看文件大小', x: 4, y: 3, iconSrc: 'https://icons-for-free.com/iconfiles/png/512/file+format+mp4+paper+icon-1320167130956649663.png' },
  { type: '2x4', Comp: LeftStorageList, name: '剩余空间', x: 0, y: 3, iconSrc: 'https://icons-for-free.com/iconfiles/png/512/storage+dropbox+dropbox+logo+file+storage+file+transfer+upload-1320196083387888656.png' },
  { type: '2x3', Comp: FlvToMp4, name: 'flv转mp4', x: 0, y: 7, iconSrc: 'https://img.icons8.com/color/96/undefined/not-sending-video-frames.png' },
  { type: 'btn', Comp: LinkBtn, name: 'onedrive网盘', x: 7, y: 3, iconSrc: 'https://img.icons8.com/clouds/150/000000/skydrive.png' },
  { type: 'btn', Comp: LinkBtn, name: '老upup', x: 11, y: 3, iconSrc: 'https://img.icons8.com/dusk/128/000000/home.png' },
  { type: 'btn', Comp: LinkBtn, name: '下载文件夹', x: 10, y: 3, iconSrc: 'https://img.icons8.com/dusk/100/000000/download.png' },
  { type: 'uploadBtn', Comp: LinkBtn, name: '上传至temp', x: 2, y: 3, iconSrc: 'https://img.icons8.com/plasticine/200/000000/add-folder.png' },
  { type: 'uploadBtn', Comp: LinkBtn, name: '上传book', x: 6, y: 7, iconSrc: 'https://img.icons8.com/color/96/000000/book-reading.png' },
  { type: 'btn', Comp: LinkBtn, name: '重启后端', x: 6, y: 7, iconSrc: 'https://img.icons8.com/bubbles/100/000000/restart.png' },
  { type: 'btn', Comp: LinkBtn, name: 'vscode', x: 6, y: 3, iconSrc: 'https://img.icons8.com/color/96/undefined/visual-studio-code-2019.png' },
  { type: 'btn', Comp: LinkBtn, name: 'book', x: 1, y: 7, iconSrc: 'https://img.icons8.com/dusk/64/000000/literature.png' },
  { type: 'btn', Comp: LinkBtn, name: '更新onedrive Index代码', x: 3, y: 3, iconSrc: 'https://img.icons8.com/color/144/000000/git.png' },
  { type: 'btn', Comp: LinkBtn, name: '回退', x: 11, y: 6, iconSrc: 'https://img.icons8.com/bubbles/2x/undo.png' },
  { type: '4x1.5', Comp: BackupImg, name: '保存涩图', x: 7, y: 8.5, iconSrc: 'https://img.icons8.com/bubbles/2x/undo.png' },
  { type: '2x6', Comp: MemChart, name: 'memPercent', x: 8, y: 0, },
  { type: '2x3', Comp: Weather, name: '天气', x: 9, y: 6, noExpend: true },
  { type: 'btn', Comp: LinkBtn, name: '更新证书', x: 0, y: 7, iconSrc: 'https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/100/000000/external-certificate-award-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png' },
  { type: '2x2', Comp: Account, name: '账号', x: 4, y: 6, iconSrc: 'https://img.icons8.com/dusk/64/000000/test-account.png', expendType: '2x4' },
  { type: '4x1.5', Comp: GoogleImg, name: '谷歌搜图', x: 7, y: 10, iconSrc: 'https://img.icons8.com/bubbles/2x/undo.png' },
  { type: '4x1.5', Comp: SaImg, name: 'sa搜图', x: 7, y: 11.5, iconSrc: 'https://saucenao.com/favicon.ico' },
  { type: 'btn', Comp: LinkBtn, name: '漫画', x: 2, y: 4, iconSrc: 'https://img.icons8.com/officexs/80/000000/comics-magazine.png' },
  { type: 'btn', Comp: LinkBtn, name: '阿里云盘', x: 3, y: 4, iconSrc: 'https://img.icons8.com/color/96/000000/network-drive.png' },
  { type: 'btn', Comp: LinkBtn, name: '油管频道', x: 11, y: 7, iconSrc: 'https://img.icons8.com/color/96/000000/youtube-studio.png' },
  { type: '5x10', Comp: WechatNew, name: '新闻', x: 0, y: 10, noExpend: true },
  // { type: '2x6', Comp: Radio, name: 'Radio', x: 2, y: 6, },
  { type: '4x1.5', Comp: WgetToRecord, name: 'wget', x: 2, y: 7, iconSrc: 'https://img.icons8.com/bubbles/2x/undo.png' },
  { type: 'btn', Comp: LinkBtn, name: 'mnt文件夹', x: 2, y: 8.5, iconSrc: 'https://img.icons8.com/color/96/hdd.png', size: '1x2.5' },
  { type: '3x2.49', Comp: NpmJump, name: 'npm', x: 3, y: 8.5, iconSrc: 'https://img.icons8.com/bubbles/2x/undo.png' },
  { type: '1x1.5', Comp: PixivNum, name: 'pixiv号', x: 6, y: 13, iconSrc: 'https://saucenao.com/favicon.ico' },
]

const buildLayout = (oriLay: any[]) => {
  let obj: any = {
    btn: (e: gridItem) => {
      if (!e.size) {
        Object.assign(e, { w: 1, h: 3 })
      }else{
        let slist = e.size.split('x')
        Object.assign(e, { w: slist[0] * 1, h: slist[1] * 1 })
      }
    },
    other: (e: gridItem) => {
      let list = e.type.split('x')
      Object.assign(e, { w: list[0] * 1, h: list[1] * 1 })
    }
  }
  obj.uploadBtn = obj.btn
  return oriLay.map((e: gridItem, i) => {
    obj[e.type] && obj[e.type](e)
    !obj[e.type] && obj.other(e)
    e.i = String(i)
    e.Comp
    // e.bg = randomStickerColor()
    return e
  })
}
const iniLayoutOri = buildLayout(originLayout)

const iniLayout = iniLayoutOri.map(e => Object.assign({}, e))
const MyHome: FC = () => {
  const timeRef = useRef(0)
  let { id } = useParams()
  const gridRef = useRef<any>()
  const conRef = useRef(null)
  const size = useSize(conRef)
  const [layout, setLayout] = useState(iniLayout)
  const sonLayoutRef = useRef<gridItem[]>()
  const [curI, setCurI] = useState<string>('')
  const isLowReso = useMemo(() => !isLowResolution(), [])


  const recoverLayout = () => {
    let list = iniLayout.map(e => {
      return { ...e }
    })
    setLayout(list)
  }

  const expendSize = (item: gridItem) => {
    // console.log("🚀 ~ file: index.tsx ~ line 97 ~ expendSize ~ item", item)
    let nsize = getNewSize(item)
    let { h, w } = item
    // console.log("🚀 ~ file: index.tsx ~ line 73 ~ expendSize ~ nsize", item, { h, w }, nsize, isEqual(nsize, { h, w }))
    // let fuck = { i: 'fuck', w: 1, h: 1, x: 12, y: 12 }
    if (item.expend) return
    !item.noExpend && nsize && setLayout((preLay) => {
      let list = preLay.map(e => ({ ...e }))
      let it = list.find(e => e.i == item.i)
      it && Object.assign(it, nsize, { expend: true })
      return list
    })

  }

  const recordMouseTime = useCallback(() => {
    let time = new Date().getTime()
    // console.log("🚀 ~ file: index.tsx ~ line 113 ~ recordMouseTime ~ time", time)
    timeRef.current = time
  }, [])

  const isLongClick = () => {
    return new Date().getTime() - timeRef.current > 200
  }

  const itemClick = (item: gridItem) => {
    // console.log(`itemClick`,);

    if (isLongClick()) return
    // console.log("🚀 ~ file: index.tsx ~ line 34 ~ itemClick ~ item", item)
    // setCurI(item.i)
    gridRef.current.removeDroppingPlaceholder()
    item.ref && item.ref.compClick && item.ref.compClick()
    expendSize(item)
    setCurI('')
    sleep(16).then(() => {
      setCurI(item.i)
      // forceUpdate() 
    })
  }
  const updateLayout = useCallback((layout: any, oldItem: any, newItem: any,) => {
    // console.log(`drstop`,);
    sonLayoutRef.current = layout
    setLayout((preLayout) => {
      let { x, y } = newItem
      // console.log("🚀 ~ file: index.tsx ~ line 146 ~ setLayout ~ newItem", newItem)
      let ite = preLayout.find(e => e.i == newItem.i)
      ite && Object.assign(ite, { x, y })
      return preLayout
    })
  }, [])

  const fnObj: Record<string, Function> = {     //索引内部的函数
    recoverLayout
  }

  const children = useMemo(() => {
    return layout.map(e => {
      let pr: any = { name: e.name, type: e.type }
      e.clickFn && (pr.clickFn = fnObj[e.clickFn])
      return (
        <div key={e.i} className={classNames(' bg-neutral-800 rounded-md transform-gpu', Style.cardItem, { 'hidden': e.i == 'fuck' })} style={{ transitionProperty: 'width, height,transform' }}  >
          <div className={classNames('w-full h-full rounded-md overflow-hidden cursor-pointer relative',
            { [Style.conActive]: curI == e.i })} onTouchStart={recordMouseTime} onMouseUp={() => { itemClick(e) }} onMouseDown={recordMouseTime}  >
            {!e.Comp || e.Comp == '' ? e.name :
              <e.Comp ref={(r: any) => { e.ref = r }} {...pr} >
                {/* {!e.expend && <GridIcon name={e.name} iconSrc={e.iconSrc || ''} />} */}
                <div className={classNames('w-full h-full basis-full shrink-0', { 'hidden': e.expend })}><GridIcon name={e.name} iconSrc={e.iconSrc || ''} /></div>
              </e.Comp>
            }
          </div>
        </div>
      )
    })
  }, [curI]);

  useEffect(() => {
  }, [layout])

  return (
    <>
      <div className={classNames('w-full bg-transparent text-cyan-100 text-base overflow-y-auto overflow-x-hidden select-none', Style.homeBg)}
        style={{ minHeight: '520px', height: 'calc(100vh - 64px)' }} ref={conRef} >
        <GridLayout ref={gridRef} className="layout" layout={layout} cols={12} rowHeight={30} width={size?.width || 1700} isResizable={false} isDraggable={isLowReso} onDragStop={updateLayout}  >
          {children}
        </GridLayout>
      </div>
    </>
  );
}

export default withKeepAlive(MyHome);
//  withKeepAlive();
