import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './wrappers/WithStore';
import { register } from './serviceWorker';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
register();
