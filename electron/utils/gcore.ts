import { BrowserWindow, ipcMain } from "electron";
import { setPlaySpeed } from "./util";

export function createGcore(mwindow: BrowserWindow) {
  ipcMain.on("broSavePlayLog", (event, val) => {
    mwindow.webContents.send('broSavePlayLog',val)    
  });

  ipcMain.on("setPlaySpeed", (event, val) => {
    let view = global.data.broView
    setPlaySpeed(view) 
  });

}