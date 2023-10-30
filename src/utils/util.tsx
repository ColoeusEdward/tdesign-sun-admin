import Space from 'components/Space';
import { getMsgOpt } from 'configs/cfg';
import define from 'configs/define';
import { FormRule, MessagePlugin } from 'tdesign-react';
import request from 'utils/request';
import { GiAnticlockwiseRotation, GiClockwiseRotation } from "react-icons/gi";
import { CgEditFlipH, CgEditFlipV } from "react-icons/cg";
import { useAtom } from 'jotai';
import { isFlipAtom } from 'pages/V8/jotai';

type customList<T> = T extends [] ? [] : T

export async function sendRequestG<T, R>(url: string, params?: R) {
  const response = request.get<T>(url, { params })
  return response
}

export async function sendRequestP<T, R>(url: string, params?: R) {
  const response = request.post<T>(url, { params })
  return response
}

export function getBaseName() {
  var env = import.meta.env.MODE || 'development';
  var root = (env === 'development' || env === 'electron') ? '/' : define.root
  console.log("🚀 ~ file: util.tsx:25 ~ getBaseName ~ root:", root)
  return root
}

export const sleep = (ms: number) => {
  return new Promise((reslove) => {
    setTimeout(reslove, ms)
  })
}

export const ajaxPromiseAll = <T extends Array<any>,>(list: any) => {
  return new Promise<T>((resolve, reject) => {
    return Promise.all(list).then(res => {
      resolve(res as T);
    }).catch(err => {
      reject(err);
    })
  })
}

export const copyToPaste = async (text: string) => {
  const clipboardObj = navigator.clipboard
  await clipboardObj.writeText(text)
  MessagePlugin.success({ content: '复制成功', ...getMsgOpt() })
}

export const numToChinese = (num: number) => {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return chnNumChar[num]
}
// const shuffle = (array) => { //数组洗牌
//   let currentIndex = array.length, randomIndex;
//   // While there remain elements to shuffle...
//   while (currentIndex != 0) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex], array[currentIndex]];
//   }
//   return array;
// }

export const shuffle = (array: any[]) => { //数组洗牌
  array.sort(() => 0.5 - Math.random());
  return array;
}

export const getRandomIntInclusive = (min: number, max: number) => { //得到一个两数之间的随机整数，包括两个数在内
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

export const firstCap = (str: string) => { //首字母大写
  return str.replace(/^\S/, s => s.toUpperCase())
}

export const debounce = (fn: Function, ms = 16) => {
  // 这里使用debounce防抖处理，防抖的延时时间可以通过自定义指令的参数传过来，如`v-resize:300`表示300ms延时
  // 也可以将此处延时去掉，放在绑定的函数中自定义
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// const atob = (str) => Buffer.from(str, "base64").toString("binary"); //解码base64字符串

export const attempt = (fn: (...args: any[]) => any, ...args: any[]) => {   //尝试运行并捕获错误
  try {
    return fn(...args);
  } catch (e: any) {
    return e instanceof Error ? e : new Error(e);
  }
};

export const attempt2 = (fn: (...args: any[]) => any, ...args: any[]) => {
  try {
    return [fn(...args), null];
  } catch (e: any) {
    return [null, e instanceof Error ? e : new Error(e)];
  }
};

export const isLowResolution = () => {
  // console.log("🚀 ~ file: index.ts ~ line 297 ~ isLowResolution ~ screen.width", screen.width)
  return screen.width < 1300

}

export const useToolBarRender = () => {
  const [, setIsFlip] = useAtom(isFlipAtom)
  const resetFlip = () => {
    setIsFlip([false, false])
  }
  const flipx = () => {
    setIsFlip((pre) => {
      let [x, y] = pre
      return [!x, y];
    })
  }
  const flipy = () => {
    setIsFlip((pre) => {
      let [x, y] = pre
      return [x, !y];
    })
  }
  const toolBarRender = ({ rotate, onRotate }: any): React.ReactNode => {
    return (
      <Space height="64px" align="center" >
        <GiAnticlockwiseRotation className={' text-2xl'} fill="#fff" onClick={() => { onRotate(rotate - 90); resetFlip() }} />
        <GiClockwiseRotation className={'text-2xl'} fill="#fff" onClick={() => { onRotate(rotate + 90); resetFlip() }} />
        <CgEditFlipH className={'text-2xl'} fill="#fff" onClick={flipx} />
        <CgEditFlipV className={'text-2xl'} fill="#fff" onClick={flipy} />
      </Space>
    )
  }
  return toolBarRender
}
export const toolBarRender = ({ rotate, onRotate, ...me }: any): React.ReactNode => {
  const [, setIsFlip] = useAtom(isFlipAtom)

  const flipx = () => {
    setIsFlip((pre) => {
      let [x, y] = pre
      return [!x, y];
    })
  }
  const flipy = () => {
    setIsFlip((pre) => {
      let [x, y] = pre
      return [x, !y];
    })
  }
  return (
    <Space height="64px" align="center" >
      <GiAnticlockwiseRotation className={' text-2xl'} fill="#fff" onClick={() => { onRotate(rotate - 90) }} />
      <GiClockwiseRotation className={'text-2xl'} fill="#fff" onClick={() => { onRotate(rotate + 90) }} />
      <CgEditFlipH className={'text-2xl'} fill="#fff" onClick={flipx} />
      <CgEditFlipV className={'text-2xl'} fill="#fff" onClick={flipy} />
    </Space>
  )
}

// export const menuClassName = 'hover:bg-slate-800 bg-slate-700'
export const menuClassName = 'hover:bg-slate-800 bg-slate-700'

export const mustRules = [{ required: true, message: '必填', type: 'error' }] as FormRule[]

export const replaceLine = (content: string) => {
  let str = content.replace(/\n\n/g, '\n')
  return str
}
// export const deepSearch = (obj:object, predicate) => {
//   let result: Object[] = [];
//   for (let p in obj) { // iterate on every property
//     // tip: here is a good idea to check for hasOwnProperty
//     if (typeof (obj[p]) == 'object') { // if its object - lets search inside it
//       result = result.concat(deepSearch(obj[p], predicate));
//     } else if (predicate(p, obj[p]))
//       result.push(obj); // check condition
//   }
//   return result;
// }
