import React from 'react';
import ReactDOM from 'react-dom/client';
// router
import { BrowserRouter } from 'react-router-dom';
// data
import store from './redux/store'; 
import { Provider } from 'react-redux';
// styles
import './styles/reset.css';
import './styles/common.css';
import './styles/forms.css';
// component
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// start react-app
