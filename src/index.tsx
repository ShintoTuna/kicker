import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import App from './App';
import './index.css';
import tableStore from './TableStore';
import playerStore from './Player/PlayerStore';
import './firebase';

useStrict(true);

const stores = {
  playerStore,
  tableStore,
};

// For easier debugging
// window._____APP_STATE_____ = stores;

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
