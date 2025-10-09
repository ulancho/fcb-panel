import { configure } from 'mobx';
import { createRoot } from 'react-dom/client';

import AppWrapper from './app/AppWrapper.tsx';
import './styles/tailwind.css';
import './styles/global.css'

configure({
  enforceActions: 'observed',
});

createRoot(document.getElementById('root')!).render(<AppWrapper />);
