import React, { useState, useEffect } from 'react';
import { format, eachDayOfInterval } from 'date-fns'; // Removido addDays, pois não é mais necessário
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Turtle } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('diário'); // Estado para alternar entre 'diário' e 'mensal'

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from || defaultFrom;
    const to = dateRange.to || defaultTo;
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    if (from && to) {
      setIsLoadingAreaChart(true);
      const apiUrl = viewMode === 'diário'
        ? `https://smi-api-production-fae2.up.railway.app/dashboard/noticias-por-periodo?dataInicio=${fromStr}&dataFim=${toStr}`
        : `https://smi-api-production-fae2.up.railway.app/dashboard/noticias-por-periodo-mensal?dataInicio=${fromStr}&dataFim=${toStr}`;

      const startTimeAreaChart = Date.now();
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Dados brutos do gráfico (${viewMode}) recebidos da API:`, data);
          let formattedData = [];
          if (viewMode === 'diário') {
            // Gerar todos os dias no intervalo
            const allDays = eachDayOfInterval({ start: from, end: to });
            const dataMap = new Map(data.map(item => [new Date(item.data).toISOString().split('T')[0], item.quantidade || 0]));
            formattedData = allDays.map(day => {
              const dayStr = day.toISOString().split('T')[0];
              const quantity = dataMap.get(dayStr) || 0;
              return {
                name: format(day, 'dd/MM', { locale: ptBR }), // Usar a data original sem ajuste
                value: quantity,
              };
            });
          } else { // Mensal
            formattedData = data.map(item => ({
              name: item.mes || 'Sem Mês',
              value: item.quantidade || 0,
            }));
          }
          console.log(`Dados formatados do gráfico (${viewMode}):`, formattedData);
          console.log(`Tempo para buscar dados do gráfico: ${(Date.now() - startTimeAreaChart) / 1000} segundos`);
          setAreaChartData(formattedData);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do gráfico:', error.message);
          console.error('Stack trace:', error.stack);
          setAreaChartData([]);
        })
        .finally(() => {
          setIsLoadingAreaChart(false);
        });
    }
  }, [dateRange, viewMode]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(event.target.value);
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header flex items-center justify-between">
        <h3 className="text-lg font-medium">Notícias por Período</h3>
        <select
          className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm"
          value={viewMode}
          onChange={handleViewModeChange}
        >
          <option value="diário">Diário</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>
      {isLoadingAreaChart ? (
        <div className="flex items-center justify-center h-[300px]">
          <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
        </div>
      ) : areaChartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhuma notícia encontrada</p>
        </div>
      ) : (
        <AreaChart
          data={areaChartData}
          height={300}
          gradientColor="#CAF10A"
          xAxisOptions={{ interval: 0, angle: -45, textAnchor: 'end' }}
        />
      )}
    </div>
  );
};

export default NoticiasPeriodo;