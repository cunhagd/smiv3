
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  updateAvaliacao?: (id: string, novaAvaliacao: string, novosPontos: number) => void;
  cursor: string | null;
  setCursor: (cursor: string | null) => void;
  nextCursor: string | null;
  limit: number;
  total: number;
  previousCursors?: string[];
  setPreviousCursors?: (cursors: string[]) => void;
}

const DataTable = ({ 
  data, 
  columns, 
  updateTema, 
  updateAvaliacao, 
  cursor, 
  setCursor, 
  nextCursor, 
  limit, 
  total,
  previousCursors = [],
  setPreviousCursors
}: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [localPreviousCursors, setLocalPreviousCursors] = useState<string[]>(previousCursors);

  const displayedData = data;

  const handleNextPage = () => {
    if (nextCursor) {
      // Salva o cursor atual para poder voltar depois
      if (cursor) {
        if (setPreviousCursors) {
          setPreviousCursors([...previousCursors, cursor]);
        } else {
          setLocalPreviousCursors(prev => [...prev, cursor]);
        }
      }
      setCursor(nextCursor);
    }
  };

  const handlePreviousPage = () => {
    const storedCursors = setPreviousCursors ? previousCursors : localPreviousCursors;
    
    if (storedCursors.length > 0) {
      // Pega o último cursor do histórico
      const lastCursor = storedCursors[storedCursors.length - 1];
      // Remove o último cursor do histórico
      if (setPreviousCursors) {
        setPreviousCursors(storedCursors.slice(0, -1));
      } else {
        setLocalPreviousCursors(prev => prev.slice(0, -1));
      }
      // Define o cursor para o último cursor do histórico
      setCursor(lastCursor);
    }
  };

  const handleGoToPage = (pageNumber: number) => {
    if (pageNumber === 1) {
      // Voltar para a primeira página
      setCursor(null);
      if (setPreviousCursors) {
        setPreviousCursors([]);
      } else {
        setLocalPreviousCursors([]);
      }
    } else if (pageNumber > currentPage) {
      // Avançar para frente
      let tempCursors = [];
      let tempNextCursor = nextCursor;
      
      // Precisamos avançar (pageNumber - currentPage) vezes
      const stepsForward = pageNumber - currentPage;
      
      if (stepsForward === 1 && nextCursor) {
        handleNextPage();
      } else {
        console.warn("Salto direto para páginas não-adjacentes não é suportado pela API atual");
        // Para APIs que suportam paginação por número de página, poderíamos implementar:
        // setCursor(`page=${pageNumber}`);
      }
    } else if (pageNumber < currentPage) {
      // Voltar páginas
      const stepsBack = currentPage - pageNumber;
      
      if (pageNumber === 1) {
        // Caso especial para voltar à primeira página
        setCursor(null);
        if (setPreviousCursors) {
          setPreviousCursors([]);
        } else {
          setLocalPreviousCursors([]);
        }
      } else if (stepsBack === 1 && storedCursors.length > 0) {
        // Voltar uma página é suportado
        handlePreviousPage();
      } else {
        console.warn("Salto direto para páginas anteriores não-adjacentes não é suportado pela API atual");
      }
    }
  };

  const handleReset = () => {
    setCursor(null);
    if (setPreviousCursors) {
      setPreviousCursors([]);
    } else {
      setLocalPreviousCursors([]);
    }
  };

  // Calcula informações de paginação
  const storedCursors = setPreviousCursors ? previousCursors : localPreviousCursors;
  const currentPage = cursor ? storedCursors.length + 2 : 1;
  const totalPages = Math.ceil(total / limit);

  // Determina quais números de página mostrar
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pageNumbers: number[] = [];

    if (totalPages <= maxVisiblePages) {
      // Se o total de páginas for menor que o máximo visível, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sempre mostrar a primeira página
      pageNumbers.push(1);

      // Determinar o ponto médio
      let startPage, endPage;
      
      if (currentPage <= 3) {
        // Se a página atual estiver no início
        startPage = 2;
        endPage = 4;
        pageNumbers.push(...Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i));
        pageNumbers.push(-1); // -1 representa uma elipse
      } else if (currentPage >= totalPages - 2) {
        // Se a página atual estiver no fim
        pageNumbers.push(-1); // elipse
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        pageNumbers.push(...Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i));
      } else {
        // Se a página atual estiver no meio
        pageNumbers.push(-1); // elipse
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push(-1); // elipse
      }

      // Sempre mostrar a última página
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

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
          Mostrando {displayedData.length} de {total} itens
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={handlePreviousPage} 
                className={`cursor-pointer ${storedCursors.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                aria-disabled={storedCursors.length === 0}
              />
            </PaginationItem>
            
            {pageNumbers.map((pageNumber, i) => 
              pageNumber === -1 ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={currentPage === pageNumber}
                    onClick={() => handleGoToPage(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={handleNextPage} 
                className={`cursor-pointer ${!nextCursor ? 'opacity-50 pointer-events-none' : ''}`}
                aria-disabled={!nextCursor}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex items-center gap-2">
          <button 
            className="px-2 py-1 rounded border border-white/10 bg-dark-card hover:bg-dark-card-hover disabled:opacity-50"
            disabled={cursor === null}
            onClick={handleReset}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
