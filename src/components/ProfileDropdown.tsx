
import React, { useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-brand-blue to-brand-yellow flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium">Ana Silva</div>
          <div className="text-xs text-gray-400">Admin • GEMEI</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-card border border-white/10 shadow-lg py-2 z-10 animate-fade-in">
          <div className="px-4 py-2 border-b border-white/5">
            <p className="text-sm font-medium">Ana Silva</p>
            <p className="text-xs text-gray-400">ana.silva@mg.gov.br</p>
          </div>
          
          <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors">
            <User className="h-4 w-4" />
            Perfil
          </a>
          
          <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5 transition-colors">
            <Settings className="h-4 w-4" />
            Configurações
          </a>
          
          <div className="border-t border-white/5 mt-1 pt-1">
            <button 
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brand-red hover:bg-white/5 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
