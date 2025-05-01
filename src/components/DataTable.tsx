import React, { useState, useRef, useEffect } from 'react';
import { Send, Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  id: string;
  header: string;
  accessorKey: string;
  sortable?: boolean;
  cell?: (info: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  updateTema?: (id: string, novoTema: string) => void;
  updateAvaliacao?: (id: string, novaAvaliacao: string) => void;
  currentDate: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
}

// Componente para exibir o menu de ações (WhatsApp)
const ActionMenu = ({ row }: { row: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatMessage = () => {
    return encodeURIComponent(
      `*${row.titulo}* \n\n` +
      `*Data:* ${row.data}\n` +
      `*Portal:* ${row.portal}\n` +
      `*Link da notícia:* ${row.link}\n\n` +
      `---\n` +
      `_Notícia compartilhada do Sistema de Monitoramento de Imprensa (SECOM GOV MG)_`
    );
  };

  const handleShare = () => {
    const whatsappURL = `https://wa.me/?text=${formatMessage()}`;
    window.open(whatsappURL, '_blank');
  };

  // Ref para o elemento do menu
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Função para verificar se o clique foi fora do menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Adiciona o listener ao documento
    document.addEventListener('mousedown', handleClickOutside);

    // Remove o listener ao desmontar o componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-white/10 p-1 rounded-full"
        aria-label="Mais ações"
      >
        <Ellipsis className="h-4 w-4 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef} // Adiciona o ref ao menu
          className="absolute right-0 mt-1 w-48 bg-dark-card border border-white/10 rounded shadow-lg z-10"
        >
          <button
            onClick={handleShare}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center space-x-2"
          >
            <span>Enviar no WhatsApp</span>
            <span><Send className="h-4 w-4 text-gray-400" /></span>
          </button>
        </div>
      )}
    </div>
  );
};

const DataTable = ({ data, columns, updateTema, updateAvaliacao, currentDate, hasNext, hasPrevious, totalItems, onNext, onPrevious, isLoading }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const displayedData = data;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-card/80 border-b border-white/5">
              {columns.map(column => (
                <th key={column.id} className="p-3 text-left whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{column.header}</span>
                    {column.sortable && (
                      <button className="focus:outline-none" disabled>
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-3 text-left w-10"></th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-white/5 hover:bg-dark-card/50 transition-colors"
              >
                {columns.map(column => (
                  <td key={column.id} className="p-3">
                    {column.cell
                      ? column.cell({
                          row,
                          updateTema,
                          updateAvaliacao
                        })
                      : row[column.accessorKey]}
                  </td>
                ))}
                <td className="p-3">
                  <ActionMenu row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayedData.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <p className="text-gray-400">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Mostrando {displayedData.length} de {totalItems} notícias {currentDate ? `em ${currentDate}` : ''}
      </div>
    </div>
  );
};

export default DataTable;