
const define = {
  root: '/site/sun/',
  // root:'/'
  wsUrl: 'wss://meamoe.ml'
}
export const setRoot = (mode: string) => {
  define.root = mode == 'development' ? '/' : '/site/sun/'
}
export const setRootByHost = () => {
  define.root = window.location.host.search('localhost') != -1 ? '/' : '/site/sun/'
}

export default define