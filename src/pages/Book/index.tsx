import MySkeleton from "components/MySkeleton";
import withKeepAlive from "hooks/withKeepAlive";
import { MacScrollbar } from "mac-scrollbar";
import { ElementRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { get_tb } from "services/nt";
// import Style from './index.module.less'
import { postData } from 'types/index'

import { useMouse } from "ahooks";
import { useAtom } from "jotai";
import { bookAtom, localPageAtom, totalBookAtom } from "jtStore/book";
import BookBottom from "./BookBottom";


type IBookProp = {
  rowClick: Function
  list: postData[]
  curUrlRef: React.MutableRefObject<string>
}
const innerHeight = window.innerHeight


const Book: React.FC = () => {
  const curLocTextNum = useRef(20)
  // const curItem = useRef<postData>()
  const [loading, setLoading] = useState(false)
  const [bookInfo, setBookInfo] = useAtom(bookAtom)

  const handleTouchStart = () => {

  }
  const handleTouchEnd = () => {

  }
  const prevPage = () => {
    window.$socket && window.$socket.emit('prevPage')
  }
  const nextPage = () => {
    window.$socket && window.$socket.emit('nextPage')
  }
  useEffect(() => {

  }, [])


  return (
    <div className={'w-full h-screen flex flex-col justify-center items-center text-neutral-500 relative overflow-hidden bg-black '} >
      <div className={'w-3/12 h-full fixed left-0 top-2'} onClick={prevPage}></div>
      <div className={'w-3/12 h-full fixed right-0 top-2'} onClick={nextPage}></div>
      <div className={'w-full h-full text-3xl leading-snug break-all text-left p-3 '} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {bookInfo.content}
      </div>
      <BookBottom />
    </div>
  )
}

export default withKeepAlive(memo(Book));