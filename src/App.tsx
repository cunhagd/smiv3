import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import SemanaEstrategica from './pages/SemanaEstrategica'; // Ajuste o caminho conforme sua estrutura
import Login from './pages/Login';

function App() {
  // Verifica se o usuário "logou" (apenas para redirecionar para o login inicialmente)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz ("/") para a página de login se não estiver autenticado */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/spreadsheet" replace /> : <Navigate to="/login" replace />} />
        {/* Remove a verificação de autenticação para todas as rotas protegidas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
        <Route path="/semana-estrategica" element={<SemanaEstrategica />} />
        {/* Mantém a rota de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;