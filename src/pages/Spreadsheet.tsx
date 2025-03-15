import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import { Filter, Download } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

const columns = [
  {
    id: 'data',
    header: 'Data',
    accessorKey: 'data',
    sortable: true,
    cell: (info) => {
      const dateValue = info.getValue ? info.getValue() : info.value;
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Data Inválida' : date.toLocaleDateString('pt-BR');
    },
  },
  {
    id: 'portal',
    header: 'Portal',
    accessorKey: 'portal',
    sortable: true,
  },
];

const Spreadsheet = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-03-01'),
    to: new Date('2025-03-15'),
  });
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect iniciado');
    setIsLoading(true);
    setError(null);
    fetch('https://smi-api-production-fae2.up.railway.app/noticias')
      .then(response => {
        console.log('Resposta bruta da API:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados das notícias recebidos da API:', data);
        if (Array.isArray(data)) {
          setNoticias(data);
        } else {
          console.warn('A resposta da API não é um array:', data);
          setNoticias([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar notícias:', error.message);
        setError(error.message);
        setNoticias([]);
      })
      .finally(() => {
        console.log('useEffect finalizado');
        setIsLoading(false);
      });
  }, []);

  const handleDateRangeChange = (range) => {
    console.log('DateRange alterado:', range);
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planilha de Matérias</h1>
            <p className="text-gray-400">Gerenciamento e análise de notícias</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <DateRangePicker onChange={handleDateRangeChange} />
            <button className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover">
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
        <div className="dashboard-card">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-red-400">Erro ao carregar dados: {error}</p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            <DataTable data={noticias} columns={columns} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Spreadsheet;