import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'tdesign-react';
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

const originLayout = [
  { type: 'btn', Comp: LinkBtn, ref: null, clickFn: 'recoverLayout', name: '复原', x: 11, y: 0, iconSrc: 'https://img.icons8.com/office/96/undefined/synchronize.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放式上传', x: 0, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/upgrade.png' },
  { type: 'btn', Comp: LinkBtn, name: '释放MP4', x: 1, y: 0, iconSrc: 'https://img.icons8.com/color/100/000000/video.png' },
  { type: 'btn', Comp: LinkBtn, name: '命令行', x: 4, y: 0, iconSrc: 'https://img.icons8.com/dusk/100/000000/command-line.png' },
  { type: 'btn', Comp: LinkBtn, name: 'aria2', x: 5, y: 0, iconSrc: 'https://raw.githubusercontent.com/mayswind/AriaNg-Native/master/assets/AriaNg.ico' },
  { type: 'btn', Comp: LinkBtn, name: '部署', x: 10, y: 0, iconSrc: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/deployment-2369058-1978336.png' },
  { type: '2x3', Comp: DeleteFile, name: '删除文件', x: 2, y: 0, iconSrc: 'https://img.icons8.com/bubbles/100/000000/delete-sign.png' },
  { type: '2x3', Comp: '', name: '上传视频至youtube', x: 6, y: 0, iconSrc: '' },
]

const buildLayout = (oriLay: any[]) => {
  let obj: any = {
    btn: (e: gridItem) => {
      Object.assign(e, { w: 1, h: 3 })
    },
    '2x3': (e: gridItem) => { Object.assign(e, { w: 2, h: 3 }) }
  }
  return oriLay.map((e: gridItem, i) => {
    obj[e.type] && obj[e.type](e)
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
    nsize && !isEqual(nsize, { h, w }) && setLayout((preLay) => {
      let list = preLay.map(e => ({ ...e }))
      let it = list.find(e => e.i == item.i)
      it && Object.assign(it, nsize, { expend: true })
      return list
    })
  }

  const recordMouseTime = () => {
    let time = new Date().getTime()
    timeRef.current = time
  }

  const isLongClick = () => {
    return new Date().getTime() - timeRef.current > 200
  }

  const itemClick = (item: gridItem) => {
    if (isLongClick()) return
    // console.log("🚀 ~ file: index.tsx ~ line 34 ~ itemClick ~ item", item)
    setCurI('')
    sleep(16).then(() => { setCurI(item.i) })
    item.ref && item.ref.compClick && item.ref.compClick()
    expendSize(item)
  }

  const updateLayout = useCallback((layout: any, oldItem: any, newItem: any) => {
    // console.log("🚀 ~ file: index.tsx ~ line 43 ~ testLayoutChange ~ layout", layout)
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
        <div key={e.i} className={' bg-neutral-800 rounded-md'} style={{ transitionProperty: 'width, height,transform', background: e.bg }}  >
          <div className={classNames('w-full h-full rounded-md overflow-hidden', { [Style.conActive]: curI == e.i })} onMouseDown={recordMouseTime} onMouseUp={() => { itemClick(e) }}>
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
    <div className={'w-full text-cyan-100 text-base border-b border-solid border-cyan-200 border-t-0 border-x-0 pl-12'}
      style={{ minHeight: '520px', maxHeight: 'calc(100vh - 64px)' }} >
      <GridLayout ref={gridRef} className="layout" layout={layout} cols={12} rowHeight={30} width={1700} isResizable={false} onDragStop={updateLayout} allowOverlap={false} >
        {children}
      </GridLayout>
    </div>
  );
}

export default withKeepAlive(memo(MyHome));
