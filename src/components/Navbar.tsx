import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-dark-bg border-b border-white/5">
      <div className="flex items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-2 mr-12">
          <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center">
            <span className="text-black font-bold text-lg">MG</span>
          </div>
          <span className="font-bold text-lg">Monitoramento de Imprensa</span>
        </Link>

        {isAuthenticated && (
          <nav className="flex items-center space-x-2">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive("/dashboard") && "active"}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/spreadsheet" 
              className={`nav-link ${isActive("/spreadsheet") && "active"}`}
            >
              Planilha
            </Link>
            <Link 
              to="/semana-estrategica" 
              className={`nav-link ${isActive("/semana-estrategica") && "active"}`}
            >
              Semana Estratégica
            </Link>
          </nav>
        )}
      </div>

      {isAuthenticated && (
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-400 text-sm font-medium"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;