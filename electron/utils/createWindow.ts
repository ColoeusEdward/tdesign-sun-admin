/*
 * @Author: 
 * @Description: electron窗口创建
 * @Date: 2022-12-27 11:45:09
 * @LastEditTime: 2023-02-03 10:17:50
 * @LastEditors: 
 */
import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createGcore } from './gcore';
import { broPlay, createShortcut } from './shortcut';
import { createAutoUpdate } from './update';
import { browserGadioPlayFirst, loopSavePlayLog, sleep } from './util';
/**
 * packages.json,script中通过cross-env NODE_ENV=production设置的环境变量
 * 'production'|'development'
 */
const NODE_ENV = process.env.NODE_ENV;
/** 创建窗口方法 */
function createWindow() {
  // 生成窗口实例
  const Window = new BrowserWindow({
    minWidth: 1700,
    minHeight: 920,
    width: 1700, // * 指定启动app时的默认窗口尺寸
    height: 920, // * 指定启动app时的默认窗口尺寸
    frame: false, // * app边框(包括关闭,全屏,最小化按钮的导航栏) @false: 隐藏
    transparent: false, // * app 背景透明
    hasShadow: true, // * app 边框阴影
    show: false, // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
    resizable: true, // 禁止手动修改窗口尺寸
    icon: './dist/fav.png', // 图标
    webPreferences: {
      // webSecurity:false,
      // 加载脚本
      preload: path.join(__dirname, '..', 'preload.js'),
      nodeIntegration: true,
    },
  });
  Window.setFullScreen(false)
  Window.setResizable(true)
  // 加载调试工具
  NODE_ENV === 'development' && Window.webContents.openDevTools();
  //  Window.webContents.openDevTools();
  // 由优雅写法a
  // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
  Window.once('ready-to-show', () => {
    Window.show(); // 显示窗口
  });

  // Window.webContents.session.setProxy({
  //   proxyRules: "socks5://127.0.0.1:7890",
  // })

  // * 主窗口加载外部链接
  // 开发环境,加载vite启动的vue项目地址
  if (NODE_ENV === 'development') Window.loadURL('http://localhost:8820/');
  // else Window.loadURL(path.join(__dirname, "./output/dist/index.html"));
  else Window.loadFile(`./dist/index.html`);
  // else Window.loadURL('http://localhost:3920/');
  createShortcut(Window)
  createAutoUpdate(Window)
  createGcore(Window)
  global.data.Window = Window
  ipcMain.on('openGadioBro', (event, data) => {
    // console.log("🚀 ~ ipcMain.on ~ val:", val)
    const view = new BrowserView({
      webPreferences: {
        // webSecurity:false,
        // 加载脚本
        preload: path.join(__dirname, '..', 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        devTools:true, 
      },
    }
    )
    Window.setBrowserView(view)
    view.setBounds({ x: 60, y: 60, width: 1640, height: 860 })
    view.webContents.loadURL(`https://www.gcores.com/radios/${data.id}/timelines`)
    global.data.broView = view
    sleep(4000).then(() => {
      // broPlay()
      browserGadioPlayFirst(view,data)
      loopSavePlayLog(view)
      // view.webContents.openDevTools()
    })
  })
  ipcMain.on('closeGadioBro', (event, val) => {
    global.data.broView?.webContents.close()
  })

}
// 导出模块
export { createWindow };
