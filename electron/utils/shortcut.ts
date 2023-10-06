/*
 * @Author:  
 * @Description: 快捷键 
 * @Date: 2022-12-29 10:01:20
 * @LastEditTime: 2022-12-29 10:06:40
 * @LastEditors:  
 */
import { BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron'


export function createShortcut(mwindow:BrowserWindow) {
  // ipcMain.handle('radioPlay', (event, arg) => {
  //   return new Promise((resolve, reject) => {
  //     resolve('play')
  //   })
  // })
  globalShortcut.register('Alt+B', () => {
    mwindow.webContents.send('radioPlay')
  })
  globalShortcut.register('Alt+F5', () => {
    mwindow.webContents.send('reload')
  })
}



