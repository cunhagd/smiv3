import React from 'react';
import { CircleArrowLeft, CircleCheckBig } from 'lucide-react';

interface UtilProps {
  filtroAtivo: 'Nenhum' | 'Útil' | 'Estrategica' | 'Lixo' | 'Suporte';
  toggleFiltroUtil: (e: React.MouseEvent) => void; // Atualizado para aceitar React.MouseEvent
}

const Util: React.FC<UtilProps> = ({ filtroAtivo, toggleFiltroUtil }) => {
  return (
    <span
      onClick={toggleFiltroUtil}
      className={
        filtroAtivo === 'Útil'
          ? 'cursor-pointer text-[#ff69ff] hover:text-[#ff99ff]'
          : 'cursor-pointer text-[#ff69ff] hover:text-[#ff99ff]'
      }
    >
      {filtroAtivo === 'Útil' ? (
        <CircleArrowLeft className="h-6 w-6" />
      ) : (
        <CircleCheckBig className="h-6 w-6" />
      )}
    </span>
  );
};

export default Util;