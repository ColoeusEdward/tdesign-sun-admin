import { Socket } from 'socket.io-client'
// import { useSocketStore } from "@/store/modules/socket"
// import { useBookStore } from '@/store/modules/book'
import { MessagePlugin } from 'tdesign-react'
import { getMsgOpt } from 'configs/cfg'
import { useAtom } from 'jotai'
import { memoryAtom } from 'jtStore/home'
import { useEffect } from 'react'

declare global {
  interface Window {
    $socket?: Socket
  }
}

let setMem = (udpate: number[]) => { }
const JtComp = () => {
  const [memory, setMemory] = useAtom(memoryAtom)
  useEffect(() => {
    console.log(`jtc`,);
    setMem = setMemory
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
    socket.emit('getMem')
    // socket.emit('getTimeWithTotal')
    // socket.emit('getTimeLoop')
  });

  socket.on('YoutubeNeedToken', () => {
    // socketStore.setYoutubeNeedToken(true)
  })
  socket.on('novelContent', (res) => {
    // bookStore.setContent(res)
  })

  window.$socket = socket

  return (<JtComp />)
}