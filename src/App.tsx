import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import SemanaEstrategica from './pages/SemanaEstrategica'; // Ajuste o caminho conforme sua estrutura
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz ("/") para a página Spreadsheet */}
        <Route path="/" element={<Navigate to="/spreadsheet" replace />} />
        {/* Remove a verificação de autenticação para todas as rotas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
        <Route path="/semana-estrategica" element={<SemanaEstrategica />} />
        {/* Mantém a rota de login, mas não é mais necessária para acessar outras abas */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;