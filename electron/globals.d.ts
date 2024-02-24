export { }
interface globalData {
  Window?: Electron.BrowserWindow,
  broView?: Electron.BrowserView
}
declare global {
  namespace globalThis {
    var data: globalData;
  }
}
