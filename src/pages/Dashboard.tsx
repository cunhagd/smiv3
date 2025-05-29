import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import DatePickerDash from '@/components/dashboard/DatePickerDash';
import TotalNoticias from '@/components/dashboard/TotalNoticias.tsx';
import NoticiasPositivas from '@/components/dashboard/NoticiasPositivas.tsx';
import NoticiasNeutras from '@/components/dashboard/NoticiasNeutras.tsx';
import NoticiasNegativas from '@/components/dashboard/NoticiasNegativas.tsx';
import Pontuacao from '@/components/dashboard/Pontuacao.tsx';
import NoticiasPeriodo from '@/components/dashboard/NoticiasPeriodo.tsx';
import SentimentoNoticias from '@/components/dashboard/SentimentoNoticias.tsx';
import EvolucaoSentimento from '@/components/dashboard/EvolucaoSentimento.tsx';
import PortaisRelevantes from '@/components/dashboard/PortaisRelevantes.tsx';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const handleDateRangeChange = (range) => {
    const normalizedRange = {
      from: range.from ? new Date(range.from.setHours(0, 0, 0, 0)) : new Date(new Date().setDate(new Date().getDate() - 30)),
      to: range.to ? new Date(range.to.setHours(0, 0, 0, 0)) : new Date(),
    };
    setDateRange(normalizedRange);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <NoticiasPeriodo dateRange={dateRange} />
          </div>
          <div className="lg:col-span-1">
            <PortaisRelevantes dateRange={dateRange} />
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