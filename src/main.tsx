import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/prata/cyrillic-400.css';
import '@fontsource/prata/latin-400.css';
import '@fontsource-variable/onest/index.css';
import './styles/global.css';
import { App } from './app/App';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
