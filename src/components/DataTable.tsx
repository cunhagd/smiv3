import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
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
  currentPage: number; // Substitui cursor por currentPage
  setCurrentPage: (page: number) => void; // Função para atualizar a página atual
  limit: number;
  total: number;
}

const DataTable = ({ data, columns, updateTema, updateAvaliacao, currentPage, setCurrentPage, total }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const displayedData = data;

  // Calcula o número total de páginas
  const totalPages = Math.ceil(total / limit);

  // Função para mudar diretamente para uma página específica
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                      <button 
                        className="focus:outline-none"
                        disabled
                      >
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
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
                  <button className="hover:bg-white/10 p-1 rounded-full">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {displayedData.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div>
          Mostrando {data.length} notícias
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1">
            Página {currentPage} de {total}
          </span>
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            Voltar ao início
          </button>
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="px-2 py-1 rounded border border-white/10 bg-dark-card text-white"
          >
            {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={currentPage === total}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
