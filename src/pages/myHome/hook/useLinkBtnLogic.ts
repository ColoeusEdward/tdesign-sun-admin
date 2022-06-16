import { RecordRelease } from "services/nt"

export default function useLinkBtnLogic() {
  const obj: Record<string, Function> = {
    '释放式上传': () => {
      RecordRelease().then(() => { })
    },
    'aria2': () => {
      window.open('https://meamoe.ml/aria2/home/')
    },
    '命令行':() => {
      window.open('https://meamoe.ml:8666/')
    }
  }
  const getRunLogic = (name: string) => {
    return obj[name]
  }

  return {
    getRunLogic
  }
}