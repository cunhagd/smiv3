import React from 'react';
import { CircleArrowLeft, Trash2 } from 'lucide-react';

interface LixeiraProps {
  filtroAtivo: 'Nenhum' | 'Lixo' | 'Estrategica';
  toggleFiltroLixo: () => void;
}

const Lixeira: React.FC<LixeiraProps> = ({ filtroAtivo, toggleFiltroLixo }) => {
  return (
    <span
      onClick={toggleFiltroLixo}
      className={
        filtroAtivo === 'Lixo'
          ? 'cursor-pointer text-red-700 hover:text-red-500'
          : 'cursor-pointer text-red-700 hover:text-red-500'
      }
    >
      {filtroAtivo === 'Lixo' ? (
        <CircleArrowLeft className="h-6 w-6" />
      ) : (
        <Trash2 className="h-6 w-6" />
      )}
    </span>
  );
};

export default Lixeira;