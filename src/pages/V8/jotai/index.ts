import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { postTData } from "types";

interface MenuItem {
  value: 'floor' | 'floorIn'
  name: '回复层' | string
}
export interface CommentInfo {
  proId?: string
  userName?: string
  repostid?: string
  quoteId?: string
}

export const curMenuItmeListAtom = atom<MenuItem[]>([{ value: 'floor', name: '回复层' }])

const curCommRefAtom = atom<{ current: CommentInfo }>({ current: {} })
export const curCommRefAtomRead = atom<{ current: CommentInfo }>((get) => {
  return get(curCommRefAtom)
})  //该数据不用于视图渲染, 不要set, 直接修改该对象

const curPostRefAtom = atom<{ current: postTData | { type: string, val: string, proId: string }[] | null }>({ current: null })
export const curPostRefAtomRead = atom<{ current: postTData | { type: string, val: string, proId: string }[] | null }>((get) => {
  return get(curPostRefAtom)
}) 