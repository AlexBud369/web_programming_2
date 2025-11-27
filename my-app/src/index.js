import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './Store/store';
import { setupCartPersistence } from './Store/Slices/cartSlice.js';
import './i18n';

setupCartPersistence(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);


