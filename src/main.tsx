import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/app';

import '@/styles/reset.css';
import '@/styles/theme.css';

const root = document.getElementById('root');

if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
