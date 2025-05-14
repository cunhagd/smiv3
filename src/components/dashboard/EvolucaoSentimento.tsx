import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Turtle } from 'lucide-react';
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

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeSentiment = Date.now();
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/sentimento-noticias?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados brutos da evolução de sentimento recebidos da API:', data);
          console.log(`Tempo para buscar dados da evolução de sentimento: ${(Date.now() - startTimeSentiment) / 1000} segundos`);
          setSentimentData(data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados da evolução de sentimento:', error.message);
          console.error('Stack trace:', error.stack);
        })
        .finally(() => {
          setIsLoadingSentiment(false);
        });
    }
  }, [dateRange]);

  const chartData = sentimentData.map(item => {
    const date = new Date(item.data);
    const adjustedDate = addDays(date, 1); // Adicione um dia à data
    return {
      name: format(adjustedDate, 'dd/MM', { locale: ptBR }), // Formate a data ajustada
      positivas: item.positivas,
      neutras: item.neutras,
      negativas: item.negativas,
    };
  });

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Evolução de Sentimento</h3>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {isLoadingSentiment ? (
        <div className="flex items-center justify-center h-[300px]">
          <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
        </div>
      ) : sentimentData.every(item => item.positivas === 0 && item.neutras === 0 && item.negativas === 0) ? (
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