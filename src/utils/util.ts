import define from 'configs/define';
import request from 'utils/request';

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
  var root = env === 'development' ? '/' : define.root
  return root
}

export const sleep = (ms:number) => {
  return new Promise((reslove) => {
    setTimeout(reslove, ms)
  })
}

export const ajaxPromiseAll = (list:any[]) => {
  return new Promise<any[]>((resolve, reject) => {
    return Promise.all(list).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

export const copyToPaste = async (text:string) => {
  const clipboardObj = navigator.clipboard
  await clipboardObj.writeText(text)
  window.$msg!.success('复制成功')
}

export const numToChinese = (num:number) => {
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

export const shuffle = (array:any[]) => { //数组洗牌
  array.sort(() => 0.5 - Math.random());
  return array;
}

export const getRandomIntInclusive = (min:number, max:number) => { //得到一个两数之间的随机整数，包括两个数在内
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

export const all = <T = any>(arr: T[], fn: (t: T) => boolean = Boolean) =>
  arr.every(fn);

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
