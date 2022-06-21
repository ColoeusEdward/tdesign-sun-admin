import { gridItem } from "types"
import { getRandomIntInclusive } from "utils/util"
import define from "configs/define";

const colorList = [`#ffb900`, `#ff8c00`, '#f7630c', '#ca5010', '#da3b01', '#ef6950', '#d13438', '#ff4343', '#e81123', '#c30052', '#e3008c', '#bf0077', '#c239b3', '#9a0089', '#0078d7', '#0063b1', '#8e8cd8', '#6b69d6', '#8764b8', '#744da9', '#881798', '#0099bc', '#2d7d9a', '#00b7c3', '#038387', '#00b294', '#018574', '#00cc6a']

export const randomStickerColor = () => {
  let idx = getRandomIntInclusive(2, colorList.length - 1)
  let item = colorList.splice(idx, 1)[0]
  colorList.unshift(item)
  let res = `linear-gradient(to right, ${colorList[0]}E6, ${colorList[1]}E6),url(${window.location.origin}${define.root}arris.svg) repeat 50%`
  return res
  // let slist = shuffle(colorList)
  // let res = `linear-gradient(to right, ${slist[0]}, ${slist[1]})`
  // return res
}

export const config: Record<string, { h: number, w: number }> = {  //展开后的size
  '2x3': { h: 6, w: 4 },
  '2x4': { h: 12, w: 4 },
}

export const getNewSize = (item: gridItem) => {
  let type: string = item.type
  return config[type]
}

