import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from "Modules/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
