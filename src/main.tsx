import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {applyDemoUrlFlags} from './utils/demoMode';

// Must run before App's state initialisers read localStorage.
applyDemoUrlFlags();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
