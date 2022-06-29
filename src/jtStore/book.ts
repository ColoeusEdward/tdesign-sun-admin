import { CursorState } from "ahooks/lib/useMouse";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export interface bookInfo {
  content: string
  page: number
}
export interface localBook {
  name: string,
  text: string,
  serverPage: number
}
export const bookAtom = atom<bookInfo>({
  content: '', page: 0
});

export const localPageAtom = atomWithStorage<number>('localPage', 0)

export const totalBookAtom = atomWithStorage<localBook>('totalBook', { name: '', text: '', serverPage: 0 })

