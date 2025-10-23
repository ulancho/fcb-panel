import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

import Cabinet from 'Common/components/cabinet';
import Login from 'Modules/login';

function App() {
  const isLoggedIn = false;

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
}

export default App;
