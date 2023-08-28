// *
//  * @Author:  
//  * @Description: 
//  * @Date: 2022-12-28 14:30:15
//  * @LastEditTime: 2023-01-04 10:36:42
//  * @LastEditors:  
//  */
import { BrowserWindow, ipcMain, screen, app } from "electron";
import { Rectangle } from "electron/main";
/**
* @description 进程通讯 渲染进程点击顶部关闭,最小化...按钮时,传递 {val}参数,
* 主进程通过 BrowserWindow.fromWebContents(event.sender)拿到活动窗口的BrowserWindow实例,再通过minimize()等实例方法操作窗口
* @param {Electron.WebContents} event.sender
* @param val {'mini'|'big'|'close'}
* @example
* window.ipc.send('navBar', val) // 渲染进程中
* */


export function onBtn() {
  ipcMain.on('reload', (event, val) => {
    /**
    * 通过BrowserWindow.fromWebContents方法拿到window实例
    * event.sender 是发送消息的WebContents实例
    */
    const window: Electron.BrowserWindow | null = BrowserWindow.fromWebContents(event.sender)
    window?.webContents.reload()

  })
}



// let defaultBounds = { x: 300, y: 200, width: 1200, height: 800 };

// function animateToMaximized(window: Electron.BrowserWindow | null,screenBounds:Rectangle ) {
//     if (!window) return
//     let { width, height } = window.getBounds()
//     // console.log(screenBounds, 'screenBounds');
//     console.log(window?.isMaximized());
//     if (width < screenBounds.width || height < screenBounds.height) {
//         window.setBounds({
//             x: defaultBounds.x,
//             y: defaultBounds.y,
//             width: Math.min(screenBounds.width, width + 10),
//             height: Math.min(screenBounds.height, height + 10)
//         })
//          setTimeout(() => animateToMaximized(window, screenBounds), 10)
//     } else {

//     }
//   }

// function animateToDefault(window: Electron.BrowserWindow | null,screenBounds:Rectangle ) {
//     if(!window) return
//     let { width, height } = window.getBounds()
//     if (width > defaultBounds.width || height > defaultBounds.height) {
//         window.setBounds({
//         x: defaultBounds.x,
//         y: defaultBounds.y,
//         width: Math.max(defaultBounds.width, width - 10),
//         height: Math.max(defaultBounds.height, height - 10)
//       })
//       setTimeout(() => animateToDefault(window, screenBounds), 10)
//     }
//   }



