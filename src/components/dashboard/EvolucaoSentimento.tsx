import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Turtle } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';

interface EvolucaoSentimentoProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const EvolucaoSentimento: React.FC<EvolucaoSentimentoProps> = ({ dateRange }) => {
  const [sentimentData, setSentimentData] = useState([]);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(true);
  const [viewMode, setViewMode] = useState('diário'); // Estado para alternar entre 'diário' e 'mensal'

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      setIsLoadingSentiment(true);
      const apiUrl = viewMode === 'diário'
        ? `https://smi-api-production-fae2.up.railway.app/dashboard/sentimento-noticias?dataInicio=${from}&dataFim=${to}`
        : `https://smi-api-production-fae2.up.railway.app/dashboard/sentimento-noticias-mensal?dataInicio=${from}&dataFim=${to}`;

      const startTimeSentiment = Date.now();
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Dados brutos da evolução de sentimento (${viewMode}) recebidos da API:`, data);
          // Validação dos dados retornados
          const validData = Array.isArray(data) ? data.filter(item => 
            (viewMode === 'diário' && item.data && item.positivas !== undefined && item.neutras !== undefined && item.negativas !== undefined) ||
            (viewMode === 'mensal' && item.mes && item.positivas !== undefined && item.neutras !== undefined && item.negativas !== undefined)
          ) : [];
          console.log(`Dados validados para ${viewMode}:`, validData);
          setSentimentData(validData);
        })
        .catch(error => {
          console.error('Erro ao buscar dados da evolução de sentimento:', error.message);
          console.error('Stack trace:', error.stack);
          setSentimentData([]);
        })
        .finally(() => {
          setIsLoadingSentiment(false);
        });
    }
  }, [dateRange, viewMode]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(event.target.value);
    // Resetar sentimentData ao mudar o modo para evitar dados residuais
    setSentimentData([]);
  };

  const chartData = viewMode === 'diário'
    ? sentimentData.map(item => {
        const date = new Date(item.data);
        const adjustedDate = addDays(date, 1); // Adicione um dia à data
        return {
          name: format(adjustedDate, 'dd/MM', { locale: ptBR }), // Formate a data ajustada
          positivas: item.positivas || 0,
          neutras: item.neutras || 0,
          negativas: item.negativas || 0,
        };
      })
    : sentimentData.map(item => ({
        name: item.mes || 'Sem Mês',
        positivas: item.positivas || 0,
        neutras: item.neutras || 0,
        negativas: item.negativas || 0,
      }));

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header flex items-center justify-between">
        <h3 className="text-lg font-medium">Evolução de Sentimento</h3>
        <select
          className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm"
          value={viewMode}
          onChange={handleViewModeChange}
        >
          <option value="diário">Diário</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>
      {isLoadingSentiment ? (
        <div className="flex items-center justify-center h-[300px]">
          <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
        </div>
      ) : sentimentData.length === 0 || sentimentData.every(item => item.positivas === 0 && item.neutras === 0 && item.negativas === 0) ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhum dado encontrado</p>
        </div>
      ) : (
        <LineChart
          data={chartData}
          height={300}
          yAxisKey={['positivas', 'neutras', 'negativas']}
          lineColors={['#CAF10A', '#AEAEAE', '#FF4D4D']}
          lineLabels={['Positivas', 'Neutras', 'Negativas']}
        />
      )}
    </div>
  );
};

export default EvolucaoSentimento;