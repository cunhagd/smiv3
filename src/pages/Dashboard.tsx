import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DatePickerDash from '@/components/dashboard/DatePickerDash';
import TotalNoticias from '@/components/dashboard/TotalNoticias.tsx';
import NoticiasPositivas from '@/components/dashboard/NoticiasPositivas.tsx';
import Pontuacao from '@/components/dashboard/Pontuacao.tsx';
import NoticiasNegativas from '@/components/dashboard/NoticiasNegativas.tsx';
import NoticiasPeriodo from '@/components/dashboard/NoticiasPeriodo.tsx'; // Novo import

const lineChartData = [
  { name: '01/05', notícias: 40 },
  { name: '02/05', notícias: 30 },
  { name: '03/05', notícias: 35 },
  { name: '04/05', notícias: 55 },
  { name: '05/05', notícias: 25 },
  { name: '06/05', notícias: 40 },
  { name: '07/05', notícias: 45 },
  { name: '08/05', notícias: 60 },
  { name: '09/05', notícias: 35 },
  { name: '10/05', notícias: 50 },
  { name: '11/05', notícias: 45 },
  { name: '12/05', notícias: 40 },
  { name: '13/05', notícias: 55 },
  { name: '14/05', notícias: 70 },
];
const sentimentData = [
  { name: 'Positivo', value: 42, color: '#CAF10A' },
  { name: 'Neutro', value: 38, color: '#AEAEAE' },
  { name: 'Negativo', value: 20, color: '#FF4D4D' },
];

const Dashboard = () => {
  const [portaisRelevantes, setPortaisRelevantes] = useState({ top5: [], bottom5: [] });
  const [selectedType, setSelectedType] = useState('positivas');
  const [isLoadingPortais, setIsLoadingPortais] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      // Buscar portais relevantes
      const startTimePortais = Date.now();
      fetch(`https://smi-api-production-fae2.up.railway.app/portais-relevantes?dataInicio=${from}&dataFim=${to}&type=${selectedType}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Dados de portais relevantes (${selectedType}) recebidos da API:`, data);
          console.log(`Tempo para buscar portais relevantes: ${(Date.now() - startTimePortais) / 1000} segundos`);
          setPortaisRelevantes(data);
        })
        .catch(error => {
          console.error('Erro ao buscar portais relevantes:', error.message);
        })
        .finally(() => {
          setIsLoadingPortais(false);
        });
    }
  }, [dateRange, selectedType]);

  const handleDateRangeChange = (range) => {
    const normalizedRange = {
      from: range.from ? new Date(range.from.setHours(0, 0, 0, 0)) : undefined,
      to: range.to ? new Date(range.to.setHours(0, 0, 0, 0)) : undefined
    };
    setDateRange(normalizedRange);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Visão geral do monitoramento de imprensa</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <DatePickerDash onChange={handleDateRangeChange} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <TotalNoticias dateRange={dateRange} />
          <NoticiasPositivas dateRange={dateRange} />
          <NoticiasNegativas dateRange={dateRange} />
          <Pontuacao dateRange={dateRange} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NoticiasPeriodo dateRange={dateRange} /> {/* Substituído por NoticiasPeriodo */}

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Portais Relevantes</h3>
              <div className="flex items-center gap-2">
                <select
                  className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <option value="positivas">Positivas</option>
                  <option value="negativas">Negativas</option>
                </select>
                <button className="p-1 hover:bg-white/5 rounded-full">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            {isLoadingPortais ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Carregando dados...</p>
              </div>
            ) : selectedType === 'negativas' && portaisRelevantes.bottom5.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Nenhuma notícia encontrada</p>
              </div>
            ) : (
              <BarChart
                data={selectedType === 'positivas' ? portaisRelevantes.top5 : portaisRelevantes.bottom5}
                height={300}
                yAxisKey="value"
                barColor={selectedType === 'positivas' ? '#CAF10A' : '#FF4D4D'}
              />
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="dashboard-card lg:col-span-2">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Evolução de Notícias</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <LineChart
              data={lineChartData}
              height={300}
              lineColor="#CAF10A"
              yAxisKey="notícias"
            />
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Sentimento das Notícias</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-[300px]">
              <div className="w-48 h-48 relative rounded-full overflow-hidden mb-6">
                {sentimentData.map((item, index) => (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      width: '100%',
                      height: '100%',
                      clip: `rect(0, ${48 * 2}px, ${48 * 2}px, ${48}px)`,
                      transform: `rotate(${index * 120}deg)`,
                      transformOrigin: 'center',
                      background: `conic-gradient(transparent ${index * (360 / sentimentData.length)}deg, ${item.color} ${index * (360 / sentimentData.length)}deg ${(index + 1) * (360 / sentimentData.length)}deg, transparent ${(index + 1) * (360 / sentimentData.length)}deg)`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-dark-card rounded-full h-32 w-32 flex items-center justify-center">
                    <span className="text-xl font-bold">42%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;