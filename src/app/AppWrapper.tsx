import { RootStoreProvider } from 'Common/stores/rootStore.tsx';

import App from './App.tsx';

const AppWrapper: React.FC = () => {
  return (
    <RootStoreProvider>
      <App />
    </RootStoreProvider>
  );
};

export default AppWrapper;
