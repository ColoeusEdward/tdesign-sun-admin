import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const clickTimeAtom = atom(0);
export const tokenAtom = atomWithStorage('meaToken', '')