import { CursorState } from "ahooks/lib/useMouse";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const clickTimeAtom = atom(0);
export const tokenAtom = atomWithStorage('meaToken', '')
export const memoryAtom = atom([1, 1])

export const mouseAtom = atom<CursorState | undefined>(undefined)

export const anchorPointAtom = atom<{ x: number, y: number }>({ x: 0, y: 0 })

export const radioFastInitCountAtom = atom(0)  
export const radioBroFastInitCountAtom = atom(0) 
