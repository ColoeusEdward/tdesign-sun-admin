/*
 * @Author:  
 * @Description: 自动更新 
 * @Date: 2022-12-29 10:01:20
 * @LastEditTime: 2022-12-29 10:06:40
 * @LastEditors:  
 */
import { app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'

export function createAutoUpdate(mwindow: BrowserWindow) {
  // ipcMain.handle('radioPlay', (event, arg) => {
  //   return new Promise((resolve, reject) => {
  //     resolve('play')
  //   })
  // })
  function checkUpdate() {
    // if (process.platform == 'darwin') {

    //   //我们使用koa-static将静态目录设置成了static文件夹，
    //   //所以访问http://127.0.0.1:9005/darwin，就相当于访问了static/darwin文件夹，win32同理
    //   autoUpdater.setFeedURL('http://127.0.0.1:9005/darwin')  //设置要检测更新的路径

    // } else {
    //   autoUpdater.setFeedURL('http://127.0.0.1:9005/darwin')  //设置要检测更新的路径
    // }

    autoUpdater.setFeedURL('https://meamoe.one/record/electronUpdate/')

    //检测更新
    autoUpdater.checkForUpdates()

    //监听'error'事件
    autoUpdater.on('error', (err) => {
      console.log(err)
      dialog.showMessageBoxSync(mwindow, {
        type: 'info',
        title: '应用更新错误',
        message: JSON.stringify(err)
      })
    })

    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
      console.log('found new version')
      dialog.showMessageBoxSync(mwindow, {
        type: 'info',
        title: 'test更新',
        message: 'found new version'
      })
    })

    //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新版本，是否更新？',
        buttons: ['是', '否']
      }).then((buttonIndex) => {
        if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
          autoUpdater.quitAndInstall()
          app.quit()
        }
      })
    })
  }

  checkUpdate()

}