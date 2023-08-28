
const define = {
  root: '/site/sun/',
  // root:'/'
  // wsUrl: 'wss://'+window.location.host
}
export const setRoot = (mode: string) => {
  let rootMap: Record<string, string> = {
    'development': '/',
    'electron': './',
  }
  define.root = rootMap[mode] || '/site/sun/' 
}
export const setRootByHost = () => {
  // define.root = window.location.host.search('localhost') != -1 ? '/' : '/site/sun/'
}

export default define