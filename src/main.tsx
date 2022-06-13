import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, BrowserRouter, MemoryRouter, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import store from 'modules/store';
import App from 'layouts/index';
import 'tdesign-react/es/style/index.css';
import './styles/index.less';
import { getBaseName } from 'utils/util';
const baseName = getBaseName()

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter basename={baseName} >
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('app'),
  );
};

renderApp();
