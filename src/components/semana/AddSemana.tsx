import React, { useState } from 'react';
import { CalendarPlus, CircleArrowLeft } from 'lucide-react';
import { FormularioSemanaEstrategica, Semana } from '@/pages/SemanaEstrategica'; // Ajuste na importação

interface AddSemanaProps {
  onAddSemana: (novaSemana: Semana) => void; // Função para adicionar nova semana
}

const AddSemana: React.FC<AddSemanaProps> = ({ onAddSemana }) => {
  const [isFormularioAtivo, setIsFormularioAtivo] = useState(false);

  const toggleFormulario = () => {
    setIsFormularioAtivo((prev) => !prev);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-end">
        <span
          onClick={toggleFormulario}
          className="cursor-pointer text-[#fde047] hover:text-[#fef08a] transition-colors"
          aria-label={isFormularioAtivo ? "Ocultar formulário de cadastro de semana estratégica" : "Mostrar formulário de cadastro de semana estratégica"}
        >
          {isFormularioAtivo ? (
            <CircleArrowLeft className="h-6 w-6 text-[#fde047] hover:text-[#fef08a] transition-colors" />
          ) : (
            <CalendarPlus className="h-6 w-6 text-[#fde047] hover:text-[#fef08a] transition-colors" />
          )}
        </span>
      </div>

      {isFormularioAtivo && (
        <FormularioSemanaEstrategica onSubmit={onAddSemana} /> // Passando a prop onSubmit corretamente
      )}
    </div>
  );
};

export default AddSemana;