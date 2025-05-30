import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';
import SemanaEstrategica from './pages/SemanaEstrategica';
import Gerenciamento from './pages/Gerenciamento';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRouter'; // Corrigido o nome do componente

// Componente interno para lidar com o redirecionamento da rota raiz
const RootRedirect = () => {
  const location = useLocation(); // Agora useLocation está dentro do contexto do Router

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir
  };

  return isAuthenticated() ? (
    <Navigate to={location.pathname === '/' ? '/spreadsheet' : location.pathname} replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota raiz ("/"): Usa o componente RootRedirect */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Rotas protegidas usando PrivateRoute */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/spreadsheet"
          element={
            <PrivateRoute>
              <Spreadsheet />
            </PrivateRoute>
          }
        />
        <Route
          path="/semana-estrategica"
          element={
            <PrivateRoute>
              <SemanaEstrategica />
            </PrivateRoute>
          }
        />
        <Route
          path="/gerenciamento"
          element={
            <PrivateRoute>
              <Gerenciamento />
            </PrivateRoute>
          }
        />
        
        {/* Rota de login, que não precisa de autenticação */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;