import { deploy, git_pull_onedrive_index, reboot_lexue, RecordRelease, ShowRecordSizeList, upload_book, upload_temp } from "services/nt"
import { DialogPlugin } from "tdesign-react"

const buildDialog = (confirmFn: () => {}) => {
  const mydialog = DialogPlugin({
    // header: 'Dialog-Plugin',
    body: '你确定?',
    theme: 'warning',
    confirmBtn: '🤗🤗🤗',
    cancelBtn: '我不到啊',
    visible: false,
    onConfirm: ({ e }) => {
      // console.log('confirm clicked', e);
      confirmFn()
      mydialog.hide();
    },
    onClose: ({ e, trigger }) => {
      mydialog.hide();
    },
  });
}

export default function useLinkBtnLogic() {
  const obj: Record<string, Function> = {
    '释放式上传': () => {
      RecordRelease().then(() => { })
    },
    'aria2': () => {
      window.open('https://meamoe.ml/aria2/home/')
    },
    '命令行': () => {
      window.open('https://meamoe.ml:8666/')
    },
    'onedrive网盘': () => {
      window.open('https://meamoe.ml/mydrive/')
    },
    '老upup': () => {
      window.open('https://meamoe.ml/upload/upload.html')
    },
    '下载文件夹': () => {
      window.open('https://meamoe.ml/record/')
    },
    '重启后端': () => {
      buildDialog(reboot_lexue)
    },
    'book': () => {
      window.open('https://meamoe.ml/site/up/bookPage')
    },
    'vscode': () => {
      window.open('https://meamoe.ml/vscode/')
    },
    '更新onedrive Index代码': () => {
      buildDialog(git_pull_onedrive_index)
    }
  }
  const uploadObj: Record<string, Function> = {
    '上传至temp': upload_temp,
    '上传book': upload_book,
    '部署': deploy
  }
  const getRunLogic = (name: string) => {
    return obj[name]
  }

  const getUploadFn = (name: string) => {
    return uploadObj[name]
  }

  return {
    getRunLogic,
    getUploadFn
  }
}