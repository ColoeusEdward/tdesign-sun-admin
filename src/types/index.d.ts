export enum ETheme {
  light = 'light',
  dark = 'dark',
}

interface baseGridItem {
  // A string corresponding to the component key
  i: string,
  // These are all in grid units, not pixels
  x: number,
  y: number,
  w: number,
  h: number,
  minW?: number,
  maxW?: number,
  minH?: number,
  maxH?: number,
}

export type gridItem = baseGridItem & Record<string, any>

export interface baseRes<T> {
  code:number
  msg:string
  data:T
}