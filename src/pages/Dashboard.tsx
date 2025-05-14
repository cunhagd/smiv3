import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import BarChart from '@/components/charts/BarChart';
import DatePickerDash from '@/components/dashboard/DatePickerDash';
import TotalNoticias from '@/components/dashboard/TotalNoticias.tsx';
import NoticiasPositivas from '@/components/dashboard/NoticiasPositivas.tsx';
import NoticiasNeutras from '@/components/dashboard/NoticiasNeutras.tsx';
import NoticiasNegativas from '@/components/dashboard/NoticiasNegativas.tsx';
import Pontuacao from '@/components/dashboard/Pontuacao.tsx';
import NoticiasPeriodo from '@/components/dashboard/NoticiasPeriodo.tsx';
import SentimentoNoticias from '@/components/dashboard/SentimentoNoticias.tsx';
import EvolucaoSentimento from '@/components/dashboard/EvolucaoSentimento.tsx';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="w-full">
            <TotalNoticias dateRange={dateRange} />
          </div>
          <div className="w-full">
            <NoticiasPositivas dateRange={dateRange} />
          </div>
          <div className="w-full">
            <NoticiasNeutras dateRange={dateRange} />
          </div>
          <div className="w-full">
            <NoticiasNegativas dateRange={dateRange} />
          </div>
          <div className="w-full">
            <Pontuacao dateRange={dateRange} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NoticiasPeriodo dateRange={dateRange} />

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
          <div className="lg:col-span-2">
            <EvolucaoSentimento dateRange={dateRange} />
          </div>
          <SentimentoNoticias dateRange={dateRange} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;