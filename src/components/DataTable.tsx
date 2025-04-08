import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Download,
  ArrowUpDown,
  MoreHorizontal,
  Check
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
  cursor: string | null;
  setCursor: (cursor: string | null) => void;
  nextCursor: string | null;
  limit: number;
  total: number;
}

const DataTable = ({ data, columns, updateTema, updateAvaliacao, cursor, setCursor, nextCursor, limit, total }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const displayedData = data;

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === displayedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayedData.map(row => row.id)));
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  const handleReset = () => {
    setCursor(null);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-4"
            disabled
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          <button className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-4 p-4 bg-dark-card border border-white/10 rounded-xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Veículo</label>
              <select className="form-input" disabled>
                <option>Todos</option>
                <option>Estado de Minas</option>
                <option>O Tempo</option>
                <option>Globo Minas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Período</label>
              <select className="form-input" disabled>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Este mês</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sentimento</label>
              <select className="form-input" disabled>
                <option>Todos</option>
                <option>Positivo</option>
                <option>Neutro</option>
                <option>Negativo</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-card/80 border-b border-white/5">
              <th className="p-3 text-left">
                <div className="flex items-center space-x-2">
                  <div 
                    className={cn(
                      "h-5 w-5 rounded border border-white/20 flex items-center justify-center cursor-pointer",
                      selectedRows.size > 0 && selectedRows.size === displayedData.length && "bg-brand-yellow border-brand-yellow"
                    )}
                    onClick={toggleAllRows}
                  >
                    {selectedRows.size > 0 && selectedRows.size === displayedData.length && (
                      <Check className="h-3 w-3 text-black" />
                    )}
                  </div>
                </div>
              </th>
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
                className={cn(
                  "border-b border-white/5 hover:bg-dark-card/50 transition-colors",
                  selectedRows.has(row.id) && "bg-dark-card/70"
                )}
              >
                <td className="p-3">
                  <div 
                    className={cn(
                      "h-5 w-5 rounded border border-white/20 flex items-center justify-center cursor-pointer",
                      selectedRows.has(row.id) && "bg-brand-yellow border-brand-yellow"
                    )}
                    onClick={() => toggleRowSelection(row.id)}
                  >
                    {selectedRows.has(row.id) && (
                      <Check className="h-3 w-3 text-black" />
                    )}
                  </div>
                </td>
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
          {selectedRows.size > 0 ? `${selectedRows.size} item(s) selecionado(s)` : `Mostrando ${displayedData.length} de ${total} itens`}
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={cursor === null}
            onClick={handleReset}
          >
            Voltar ao início
          </button>
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={!nextCursor}
            onClick={handleNextPage}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;