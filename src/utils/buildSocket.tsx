import { Socket } from 'socket.io-client'
// import { useSocketStore } from "@/store/modules/socket"
// import { useBookStore } from '@/store/modules/book'
import { MessagePlugin, NotificationPlugin } from 'tdesign-react'
import { getMsgOpt } from 'configs/cfg'
import { useAtom } from 'jotai'
import { memoryAtom } from 'jtStore/home'
import { useEffect } from 'react'
import { bookAtom, bookInfo } from 'jtStore/book'
import { useDispatch } from 'react-redux'
import { switchTheme } from 'modules/global'
import { ETheme } from 'types/index.d';
import { replaceLine } from './util'
let cacheCount = 0

declare global {
  interface Window {
    $socket?: Socket,
    myCountKey: number
  }
}

let setMem = (udpate: number[]) => { }
let setBook = (udpate: bookInfo) => { }
const JtComp = () => {
  const [, setMemory] = useAtom(memoryAtom)
  const [, setBookInfo] = useAtom(bookAtom)
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(`jtc`,);
    setMem = setMemory
    setBook = setBookInfo
    if (window.location.href.search('bookPage') != -1)
      dispatch(switchTheme(ETheme.dark))
  }, [])
  return (<div></div>)
}

export function buildSocket(socket: Socket) {
  // jtComp()
  // const bookStore = useBookStore()
  socket.on('getMem', (res) => {
    setMem(res)
  })
  socket.on('start', (res) => {
    MessagePlugin.success({ content: res, ...getMsgOpt() })
  })
  socket.on('stop', (res) => {
    MessagePlugin.success({ content: res, ...getMsgOpt() })
  })
  socket.on('reset', (res) => {
    MessagePlugin.success({ content: res, ...getMsgOpt() })
  })
  socket.on('getTimeLoop', (res) => {
    if (res.total) {
      // socketStore.setTotalTime(res.total)
      // socketStore.setTime(res.time)
    } else {
      // socketStore.setTime(res)
    }
  })
  // socket.io.on("reconnect", (attempt) => {
  //   console.log(`reconnect触发`,);
  //   socket.emit('getMem')
  // });
  socket.on("connect", () => {
    if (window.location.href.search('/bookPage') != -1) {
      return
    }
    socket.emit('getMem')
    // socket.emit('getTimeWithTotal')
    // socket.emit('getTimeLoop')
  });

  socket.on('YoutubeNeedToken', () => {
    // socketStore.setYoutubeNeedToken(true)
  })
  socket.on('novelContent', (res) => {
    setBook({
      content: res.text,
      page: res.page
    })
    // bookStore.setContent(res)
  })

  socket.on('GradioOK', (res) => {
    let dur = 0
    if (cacheCount == 0) {  //第一次加载时自动消， 因为第一次都是自动检查
      dur = 2000
    }
    NotificationPlugin.success({ title: 'Gradio OK', duration: dur, content: '机核下载处理成功', offset: [-20, 20], closeBtn: true })
    cacheCount++;
  })

  window.$socket = socket

  return (<JtComp />)
}