import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import store from 'modules/store';
import App from 'layouts/index';
import 'tdesign-react/es/style/index.css';
import './styles/index.less';
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import './theme.css'
import 'mac-scrollbar/dist/mac-scrollbar.css';
import 'react-photo-view/dist/react-photo-view.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import './index.css'
import { getBaseName } from 'utils/util';
import { AliveScope } from 'react-activation';
import define, { setRoot, setRootByHost } from 'configs/define';
import { buildSocket } from 'utils/buildSocket';
import { io, Socket } from 'socket.io-client';
import 'react-indiana-drag-scroll/dist/style.css'
import { config } from 'configs/cfg';
const env = import.meta.env.MODE
setRoot(env)
const baseName = getBaseName()

const socket: Socket = io(config.wsUrl, {
  transports: ["websocket"]
  , reconnectionDelayMax: 10000
  , reconnectionDelay: 5000
})


const renderApp = () => {
  setRootByHost()
  window.myCountKey = 0
  const container = document.getElementById('app');
  const root = createRoot(container!);
  let renderRouter = (
    <BrowserRouter basename={baseName} >
      <AliveScope>
        <App />
      </AliveScope>
    </BrowserRouter>
  )
  if (env == 'electron') {
    renderRouter = (
      <HashRouter basename={baseName} >
        <AliveScope>
          <App />
        </AliveScope>
      </HashRouter>
    )
  }
  root.render(
    <Provider store={store}>
      {buildSocket(socket)}
      {renderRouter}
    </Provider>
  )
  // ReactDOM.render(
  //   <Provider store={store}>
  //     <BrowserRouter basename={baseName} >
  //       <App />
  //     </BrowserRouter>
  //   </Provider>,
  //   document.getElementById('app'),
  // );
};

renderApp();
