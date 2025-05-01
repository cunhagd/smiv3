import React from 'react';
import { CircleArrowLeft, Lightbulb } from 'lucide-react';

interface SuporteProps {
  filtroAtivo: 'Nenhum' | 'Suporte' | 'Estrategica';
  toggleFiltroSuporte: () => void;
}

const Suporte: React.FC<SuporteProps> = ({ filtroAtivo, toggleFiltroSuporte }) => {
  return (
    <span
      onClick={toggleFiltroSuporte}
      className={
        filtroAtivo === 'Suporte'
          ? 'cursor-pointer text-[#72C5FD] hover:text-[#bde4fe]'
          : 'cursor-pointer text-[#72C5FD] hover:text-[#bde4fe]'
      }
    >
      {filtroAtivo === 'Suporte' ? (
        <CircleArrowLeft className="h-6 w-6" />
      ) : (
        <Lightbulb className="h-6 w-6" />
      )}
    </span>
  );
};

export default Suporte;