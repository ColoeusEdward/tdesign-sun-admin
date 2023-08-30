/*
 * @Author: 
 * @Description: electron窗口创建
 * @Date: 2022-12-27 11:45:09
 * @LastEditTime: 2023-02-03 10:17:50
 * @LastEditors: 
 */
import { BrowserWindow } from 'electron';
import * as path from 'path';
import { createShortcut } from './shortcut';
import { createAutoUpdate } from './update';
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
    minHeight: 800,
    // width: 1600, // * 指定启动app时的默认窗口尺寸
    // height: 920, // * 指定启动app时的默认窗口尺寸
    frame: false, // * app边框(包括关闭,全屏,最小化按钮的导航栏) @false: 隐藏
    transparent: true, // * app 背景透明
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

  // * 主窗口加载外部链接
  // 开发环境,加载vite启动的vue项目地址
  if (NODE_ENV === 'development') Window.loadURL('http://localhost:8820/');
  // else Window.loadURL(path.join(__dirname, "./output/dist/index.html"));
  else Window.loadFile(`./dist/index.html`);
  // else Window.loadURL('http://localhost:3920/');
  createShortcut(Window)
  createAutoUpdate(Window)
}
// 导出模块
export { createWindow };
