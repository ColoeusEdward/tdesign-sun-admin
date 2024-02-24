import { BrowserWindow, ipcMain } from "electron";

export function createGcore(mwindow: BrowserWindow) {
  ipcMain.on("broSavePlayLog", (event, val) => {
    mwindow.webContents.send('broSavePlayLog',val)    
  });

}