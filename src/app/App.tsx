import { observer } from 'mobx-react-lite';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

import Cabinet from 'Common/components/cabinet';
import { useLoginStore } from 'Common/stores/rootStore.tsx';
import Login from 'Modules/login';

const App = observer(() => {
  const loginService = useLoginStore();
  const isLoggedIn = loginService.isLogged;

  return (
    <BrowserRouter>
      {isLoggedIn && <Cabinet />}
      {!isLoggedIn && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
});

export default App;
