import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, MessagePlugin } from 'tdesign-react';
import { CheckCircleIcon } from 'tdesign-icons-react';
import { useParams } from 'react-router-dom';
import withKeepAlive from 'hooks/withKeepAlive';
import GridLayout from "react-grid-layout";
import { useAtom } from 'jotai';
import { clickTimeAtom } from 'jtStore/home';
import { gridItem } from 'types';
import { getNewSize, randomStickerColor } from './itemSizeConfig';
import { sleep } from 'utils/util';
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


const originLayout = [
  { type: 'btn', Comp: LinkBtn, ref: null, clickFn: 'recoverLayout', name: '复原', x: 11, y: 0, iconSrc: 'https://img.icons8.com/office/96/undefined/synchronize.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放式上传', x: 0, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/upgrade.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放MP4', x: 1, y: 0, iconSrc: 'https://img.icons8.com/color/100/000000/video.png' },
  { type: 'btn', Comp: LinkBtn, name: '命令行', x: 4, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/command-line.png' },
  { type: 'btn', Comp: LinkBtn, name: 'aria2', x: 5, y: 0, iconSrc: 'https://img.icons8.com/color/96/undefined/launched-rocket--v1.png' },
  { type: 'btn', Comp: LinkBtn, name: '部署', x: 10, y: 0, iconSrc: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/deployment-2369058-1978336.png' },
  { type: '2x3', Comp: DeleteFile, name: '删除文件', x: 2, y: 0, iconSrc: 'https://img.icons8.com/bubbles/100/000000/delete-sign.png' },
  { type: '2x3', Comp: FreeCloudUpload, name: '自由上传文件', x: 7, y: 6, iconSrc: 'https://img.icons8.com/bubbles/100/000000/upload.png' },
  { type: '2x3', Comp: MySkeleton, name: '上传视频至youtube', x: 6, y: 0, iconSrc: '' },
  { type: '2x4', Comp: RecordList, name: '查看文件大小', x: 4, y: 3, iconSrc: 'https://icons-for-free.com/iconfiles/png/512/file+format+mp4+paper+icon-1320167130956649663.png' },
  { type: '2x4', Comp: LeftStorageList, name: '剩余空间', x: 0, y: 3, iconSrc: 'https://icons-for-free.com/iconfiles/png/512/storage+dropbox+dropbox+logo+file+storage+file+transfer+upload-1320196083387888656.png' },
  // { type: '2x3', Comp: '', name: '上传视频至youtube', x: 6, y: 0, iconSrc: '' },
  // { type: '2x3', Comp: '', name: '上传视频至youtube', x: 6, y: 0, iconSrc: '' },
]

const buildLayout = (oriLay: any[]) => {
  let obj: any = {
    btn: (e: gridItem) => {
      Object.assign(e, { w: 1, h: 3 })
    },
    other: (e: gridItem) => {
      let list = e.type.split('x')
      Object.assign(e, { w: list[0]*1, h: list[1]*1 })
    }
  }
  return oriLay.map((e: gridItem, i) => {
    obj[e.type] && obj[e.type](e)
    !obj[e.type] && obj.other(e)
    e.i = String(i)
    e.Comp
    e.bg = randomStickerColor()
    return e
  })
}
const iniLayout = buildLayout(originLayout)

const MyHome: FC = () => {
  const timeRef = useRef(0)
  let { id } = useParams()
  const gridRef = useRef<any>()
  const [layout, setLayout] = useState(iniLayout.map(e => Object.assign({}, e)))
  const sonLayoutRef = useRef<gridItem[]>()
  const [curI, setCurI] = useState<string>('')


  const recoverLayout = () => {
    let list = iniLayout.map(e => {
      return { ...e }
    })
    setLayout(list)
  }

  const expendSize = (item: gridItem) => {
    let nsize = getNewSize(item)
    let { h, w } = item
    // console.log("🚀 ~ file: index.tsx ~ line 73 ~ expendSize ~ nsize", item, { h, w }, nsize, isEqual(nsize, { h, w }))
    if (item.expend) return
    nsize && !isEqual(nsize, { h, w }) && setLayout((preLay) => {
      let list = preLay.map(e => ({ ...e }))
      let it = list.find(e => e.i == item.i)
      it && Object.assign(it, nsize, { expend: true })
      // console.log("🚀 ~ file: index.tsx ~ line 79 ~ nsize&&!isEqual ~ it", it)
      return list
    })

  }

  const recordMouseTime = useCallback(() => {
    let time = new Date().getTime()
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
    setCurI('')
    sleep(16).then(() => {
      setCurI(item.i)
      item.ref && item.ref.compClick && item.ref.compClick()
      expendSize(item)
    })
  }
  const updateLayout = useCallback((layout: any, oldItem: any, newItem: any) => {
    sonLayoutRef.current = layout
    setLayout((preLayout) => {
      let { x, y } = newItem
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
      let pr: any = { name: e.name }
      e.clickFn && (pr.clickFn = fnObj[e.clickFn])
      return (
        <div key={e.i} className={classNames(' bg-neutral-800 rounded-md ', Style.cardItem)} style={{ transitionProperty: 'width, height,transform' }}  >
          <div className={classNames('w-full h-full rounded-md overflow-hidden',
            { [Style.conActive]: curI == e.i })} onMouseUp={() => { itemClick(e) }} >
            {!e.Comp || e.Comp == '' ? e.name :
              <e.Comp ref={(r: any) => { e.ref = r }} {...pr} >
                {/* {!e.expend && <GridIcon name={e.name} iconSrc={e.iconSrc || ''} />} */}
                <div className={classNames('w-full h-full', { 'hidden': e.expend })}><GridIcon name={e.name} iconSrc={e.iconSrc || ''} /></div>
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
      <div className={classNames('w-full bg-transparent text-cyan-100 text-base  pl-12 overflow-auto select-none', Style.homeBg)}
        style={{ minHeight: '520px', height: 'calc(100vh - 64px)' }} >
        <GridLayout ref={gridRef} className="layout" layout={layout} cols={12} rowHeight={30} width={1700} isResizable={false} onDragStop={updateLayout} onDragStart={recordMouseTime} allowOverlap={false} >
          {children}
        </GridLayout>
      </div>
    </>
  );
}

export default withKeepAlive(memo(MyHome));
//  withKeepAlive();
