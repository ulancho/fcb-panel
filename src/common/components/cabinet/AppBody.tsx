import { Route, Routes } from 'react-router-dom';

import Registration from 'Modules/clients/registration';
import Form from 'Modules/clients/registration/Form.tsx';

export const AppBody = () => {
  return (
    <Routes>
      <Route path="/client/registration" element={<Registration />} />
      <Route path="/client/registration-form" element={<Form />} />
    </Routes>
  );
};
