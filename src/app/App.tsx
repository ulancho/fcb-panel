import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Cabinet from 'Common/components/cabinet';
import Login from 'Modules/login';

function App() {
  const isLoggedIn = true;

  return (
    <>
      {isLoggedIn && <Cabinet />}
      {!isLoggedIn && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
