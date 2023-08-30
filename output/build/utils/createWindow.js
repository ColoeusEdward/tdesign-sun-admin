"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWindow = void 0;
/*
 * @Author:
 * @Description: electron窗口创建
 * @Date: 2022-12-27 11:45:09
 * @LastEditTime: 2023-02-03 10:17:50
 * @LastEditors:
 */
const electron_1 = require("electron");
const path = __importStar(require("path"));
const shortcut_1 = require("./shortcut");
const update_1 = require("./update");
/**
 * packages.json,script中通过cross-env NODE_ENV=production设置的环境变量
 * 'production'|'development'
 */
const NODE_ENV = process.env.NODE_ENV;
/** 创建窗口方法 */
function createWindow() {
    // 生成窗口实例
    const Window = new electron_1.BrowserWindow({
        minWidth: 1700,
        minHeight: 800,
        // width: 1600, // * 指定启动app时的默认窗口尺寸
        // height: 920, // * 指定启动app时的默认窗口尺寸
        frame: false,
        transparent: true,
        hasShadow: true,
        show: false,
        resizable: true,
        icon: './dist/fav.png',
        webPreferences: {
            // webSecurity:false,
            // 加载脚本
            preload: path.join(__dirname, '..', 'preload.js'),
            nodeIntegration: true,
        },
    });
    Window.setFullScreen(false);
    Window.setResizable(true);
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
    if (NODE_ENV === 'development')
        Window.loadURL('http://localhost:8820/');
    // else Window.loadURL(path.join(__dirname, "./output/dist/index.html"));
    else
        Window.loadFile(`./dist/index.html`);
    // else Window.loadURL('http://localhost:3920/');
    (0, shortcut_1.createShortcut)(Window);
    (0, update_1.createAutoUpdate)(Window);
}
exports.createWindow = createWindow;
