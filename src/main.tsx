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
import './index.css'
import { getBaseName } from 'utils/util';
import { AliveScope } from 'react-activation';
import { setRootByHost } from 'configs/define';
const baseName = getBaseName()

const renderApp = () => {
  setRootByHost()
  const container = document.getElementById('app');
  const root = createRoot(container!);
  root.render(
    <Provider store={store}>
      <BrowserRouter basename={baseName} >
        <AliveScope>
          <App />
        </AliveScope>
      </BrowserRouter>
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
