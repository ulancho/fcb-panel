import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Registration from 'Modules/clients/registration';

export const AppBody = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
};
