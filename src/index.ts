import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './WithStore';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
registerServiceWorker();
