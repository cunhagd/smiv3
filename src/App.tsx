import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import SemanaEstrategica from './pages/SemanaEstrategica'; // Ajuste o caminho conforme sua estrutura

function App() {
  // Simulando verificação de autenticação
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz ("/") para a página Spreadsheet, já que o login foi removido */}
        <Route path="/" element={<Navigate to="/spreadsheet" replace />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/spreadsheet" replace />}
        />
        <Route
          path="/spreadsheet"
          element={isAuthenticated ? <Spreadsheet /> : <Navigate to="/spreadsheet" replace />}
        />
        <Route
          path="/semana-estrategica"
          element={isAuthenticated ? <SemanaEstrategica /> : <Navigate to="/spreadsheet" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;