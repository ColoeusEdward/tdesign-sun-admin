import { deploy, git_pull_onedrive_index, mp4_release, reboot_lexue, RecordRelease, roll_back_sun, ShowRecordSizeList, update_ecc, upload_book, upload_temp } from "services/nt"
import { DialogPlugin } from "tdesign-react"

const buildDialog = (confirmFn: () => {}) => {
  const mydialog = DialogPlugin({
    // header: 'Dialog-Plugin',
    body: '你确定?',
    theme: 'warning',
    confirmBtn: '🤗🤗🤗',
    cancelBtn: '我不到啊',
    visible: true,
    onConfirm: ({ e }) => {
      // console.log('confirm clicked', e);
      confirmFn()
      mydialog.hide!();
    },
    onClose: ({ e, trigger }) => {
      mydialog.hide!();
    },
  });
}

export default function useLinkBtnLogic() {
  const obj: Record<string, Function> = {
    '释放式上传': () => {
      RecordRelease().then(() => { })
    },
    '释放MP4':() => {
      buildDialog(mp4_release)
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
      window.open('https://meamoe.ml/site/sun/bookPage')
    },
    'vscode': () => {
      window.open('https://meamoe.ml/vscode/')
    },
    '更新onedrive Index代码': () => {
      buildDialog(git_pull_onedrive_index)
    },
    '回退':() => {
      buildDialog(roll_back_sun)
    },
    '更新证书':() => {
      buildDialog(update_ecc)
    },
    '漫画':() => {
      window.open('https://meamoe.ml/manga/')
    },
    '阿里云盘':() => {
      window.open('https://www.aliyundrive.com/drive/')
    },
    '油管频道':() => {
      window.open('https://studio.youtube.com/channel/UCGJkkwFknnsqE6oHH5EalVg/videos/upload')
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