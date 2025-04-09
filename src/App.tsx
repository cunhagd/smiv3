
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import Login from './pages/Login';

function App() {
  // Simulando verificação de autenticação
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
        <Route path="/login" element={<Login />} />
=======
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/spreadsheet" element={isAuthenticated ? <Spreadsheet /> : <Navigate to="/login" replace />} />
>>>>>>> 490d8ae6ea31a7ebca394bbb6d7e291643d2814e
      </Routes>
    </Router>
  );
}

export default App;
