import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns'; // Adicionado addDays
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import AreaChart from '@/components/charts/AreaChart';

interface NoticiasPeriodoProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const NoticiasPeriodo: React.FC<NoticiasPeriodoProps> = ({ dateRange }) => {
  const [areaChartData, setAreaChartData] = useState([]);
  const [isLoadingAreaChart, setIsLoadingAreaChart] = useState(true);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeAreaChart = Date.now();
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-por-periodo?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados brutos do gráfico recebidos da API:', data);
          const formattedData = data.map(item => {
            const date = new Date(item.data);
            if (isNaN(date.getTime())) {
              throw new Error(`Data inválida após conversão: ${item.data}`);
            }
            // Ajustar a data para o início do dia (00:00:00) no fuso horário local
            date.setHours(0, 0, 0, 0);
            // Adicionar um dia à data para associar os dados ao dia seguinte
            const adjustedDate = addDays(date, 1);
            return {
              name: format(adjustedDate, 'dd/MMM', { locale: ptBR }).toLowerCase(),
              value: item.quantidade
            };
          });
          console.log('Dados formatados do gráfico:', formattedData);
          console.log(`Tempo para buscar dados do gráfico: ${(Date.now() - startTimeAreaChart) / 1000} segundos`);
          setAreaChartData(formattedData);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do gráfico:', error.message);
          console.error('Stack trace:', error.stack);
        })
        .finally(() => {
          setIsLoadingAreaChart(false);
        });
    }
  }, [dateRange]);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Notícias por Período</h3>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {isLoadingAreaChart ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      ) : areaChartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhuma notícia encontrada</p>
        </div>
      ) : (
        <AreaChart data={areaChartData} height={300} gradientColor="#CAF10A" />
      )}
    </div>
  );
};

export default NoticiasPeriodo;