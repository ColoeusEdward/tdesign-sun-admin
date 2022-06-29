import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import store from 'modules/store';
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
import define, { setRootByHost } from 'configs/define';
import { buildSocket } from 'utils/buildSocket';
import { io, Socket } from 'socket.io-client';
import Book from 'pages/Book';
const baseName = getBaseName()

const socket: Socket = io(define.wsUrl, {
  transports: ["websocket"]
  , reconnectionDelayMax: 10000
  , reconnectionDelay: 5000
})



const renderApp = () => {
  setRootByHost()
  const container = document.getElementById('app');
  const root = createRoot(container!);
  root.render(
    <Provider store={store}>
      {buildSocket(socket)}
      <AliveScope>
        <Book></Book>
      </AliveScope>
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
