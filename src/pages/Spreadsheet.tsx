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
    cell: (info: any) => {
      const date = new Date(info.getValue());
      return date.toLocaleDateString('pt-BR');
    },
  },
  {
    id: 'portal',
    header: 'Portal',
    accessorKey: 'portal',
    sortable: true,
  },
  {
    id: 'titulo',
    header: 'Título',
    accessorKey: 'titulo',
    sortable: true,
  },
  {
    id: 'pontos',
    header: 'Pontos',
    accessorKey: 'pontos',
    sortable: true,
  },
  {
    id: 'sentimento',
    header: 'Sentimento',
    accessorKey: 'sentimento',
    sortable: true,
    cell: (info: any) => {
      const sentiment = info.getValue();
      let bgColor = 'bg-gray-400';
      let textColor = 'text-black';
      
      if (sentiment === 'Positivo') {
        bgColor = 'bg-brand-yellow';
      } else if (sentiment === 'Negativo') {
        bgColor = 'bg-brand-red';
      } else if (sentiment === 'Neutro') {
        bgColor = 'bg-gray-400';
      }
      
      return (
        <span className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full`}>
          {sentiment}
        </span>
      );
    },
  },
  {
    id: 'abrangencia',
    header: 'Abrangência',
    accessorKey: 'abrangencia',
    sortable: true,
  },
];

const Spreadsheet = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-02-15'),
    to: new Date('2025-03-15'),
  });
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const from = dateRange.from?.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0];

    console.log('Intervalo de datas selecionado:', { from, to });

    if (from && to) {
      setIsLoading(true);
      setError(null);
      fetch(`https://smi-api-production-fae2.up.railway.app/noticias?from=${from}&to=${to}`)
        .then(response => {
          console.log('Resposta bruta da API:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados da planilha recebidos da API:', data);
          if (Array.isArray(data)) {
            setNewsData(data);
          } else {
            console.warn('A resposta da API não é um array:', data);
            setNewsData([]);
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados da planilha:', error.message);
          setError(error.message);
          setNewsData([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
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
          ) : newsData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Nenhum dado encontrado para o período selecionado</p>
            </div>
          ) : (
            <DataTable data={newsData} columns={columns} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Spreadsheet;