
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, BellRing } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-dark-bg border-b border-white/5">
      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2 mr-12">
          <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center">
            <span className="text-black font-bold text-lg">MG</span>
          </div>
          <span className="font-bold text-lg">Monitoramento de Imprensa</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            to="/dashboard" 
            className={cn("nav-link", isActive("/dashboard") && "active")}
          >
            Dashboard
          </Link>
          <Link 
            to="/spreadsheet" 
            className={cn("nav-link", isActive("/spreadsheet") && "active")}
          >
            Planilha
          </Link>
          <Link 
            to="/analytics" 
            className={cn("nav-link", isActive("/analytics") && "active")}
          >
            Analytics
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-dark-card/50 border border-white/10 rounded-full px-4 py-2 pl-10 w-64 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <button className="relative">
          <BellRing className="h-5 w-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-brand-red rounded-full"></span>
        </button>
        
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
