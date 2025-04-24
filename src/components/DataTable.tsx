
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
  updateAvaliacao?: (id: string, novaAvaliacao: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
  total: number;
  currentDate?: string; // Data atual que está sendo exibida
  availableDates?: string[]; // Lista de datas disponíveis
}

const DataTable = ({ 
  data, 
  columns, 
  updateTema, 
  updateAvaliacao, 
  currentPage, 
  setCurrentPage, 
  total,
  currentDate,
  availableDates = []
}: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const displayedData = data;

  // Para renderizar os controles de paginação
  const renderPaginationControls = () => {
    if (availableDates.length === 0) return null;
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1} 
              className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>

          {availableDates.length > 10 ? (
            renderPageNumbers()
          ) : (
            availableDates.map((date, index) => (
              <PaginationItem key={date}>
                <PaginationLink
                  isActive={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(availableDates.length, currentPage + 1))}
              disabled={currentPage >= availableDates.length}
              className={currentPage >= availableDates.length ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderPageNumbers = () => {
    const totalPages = availableDates.length;
    
    // Determinar quais páginas mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Ajustar se estiver perto do final
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    const pages = [];
    
    // Primeira página
    if (startPage > 1) {
      pages.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => setCurrentPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Mostrar ellipsis se necessário
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Última página
    if (endPage < totalPages) {
      // Mostrar ellipsis se necessário
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
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
          {currentDate && (
            <span className="ml-1 font-medium">• {currentDate}</span>
          )}
        </div>
        {renderPaginationControls()}
      </div>
    </div>
  );
};

export default DataTable;
