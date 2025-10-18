import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Registration from 'Modules/clients/registration';
import Login from 'Modules/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
