import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './WithStore';
import registerServiceWorker from './registerServiceWorker';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(<App />, document.getElementById('root'));
/* eslint-enable react/jsx-filename-extension */
registerServiceWorker();
