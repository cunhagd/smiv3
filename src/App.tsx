import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import SemanaEstrategica from './pages/SemanaEstrategica'; // Ajuste o caminho conforme sua estrutura
import Login from './pages/Login';

function App() {
  // Simulando verificação de autenticação
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/spreadsheet"
          element={isAuthenticated ? <Spreadsheet /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/semana-estrategica"
          element={isAuthenticated ? <SemanaEstrategica /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;