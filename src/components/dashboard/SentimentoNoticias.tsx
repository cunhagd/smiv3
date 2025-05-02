import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';

interface SentimentoNoticiasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const SentimentoNoticias: React.FC<SentimentoNoticiasProps> = ({ dateRange }) => {
  const [sentimentData, setSentimentData] = useState([
    { name: 'Positivo', value: 0, color: '#CAF10A' },
    { name: 'Neutro', value: 0, color: '#AEAEAE' },
    { name: 'Negativo', value: 0, color: '#FF4D4D' },
  ]);
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
          console.log('Dados brutos do sentimento recebidos da API:', data);
          const totals = data.reduce(
            (acc, item) => {
              acc.positivas += item.positivas || 0;
              acc.negativas += item.negativas || 0;
              acc.neutras += item.neutras || 0;
              return acc;
            },
            { positivas: 0, negativas: 0, neutras: 0 }
          );
          const total = totals.positivas + totals.negativas + totals.neutras;
          const newSentimentData = [
            { name: 'Positivo', value: totals.positivas, color: '#CAF10A' },
            { name: 'Neutro', value: totals.neutras, color: '#AEAEAE' },
            { name: 'Negativo', value: totals.negativas, color: '#FF4D4D' },
          ];
          console.log('Dados formatados do sentimento:', newSentimentData);
          console.log(`Tempo para buscar dados do sentimento: ${(Date.now() - startTimeSentiment) / 1000} segundos`);
          setSentimentData(newSentimentData);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do sentimento:', error.message);
          console.error('Stack trace:', error.stack);
        })
        .finally(() => {
          setIsLoadingSentiment(false);
        });
    }
  }, [dateRange]);

  // Calcular o total de todas as notícias
  const total = sentimentData.reduce((acc, item) => acc + item.value, 0);

  // Calcular os ângulos acumulados para cada seção do gráfico de pizza
  let accumulatedAngle = 0;
  const gradientStops = sentimentData.map(item => {
    const proportion = total > 0 ? item.value / total : 0;
    const angle = proportion * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return { color: item.color, startAngle, endAngle: accumulatedAngle };
  });

  // Gerar a string de conic-gradient
  const gradientString = gradientStops
    .map(({ color, startAngle, endAngle }) => `${color} ${startAngle}deg ${endAngle}deg`)
    .join(', ');

  // Calcular percentuais e ordenar do maior para o menor
  const percentData = sentimentData
    .map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }))
    .filter(item => item.value > 0) // Filtrar apenas valores > 0
    .sort((a, b) => b.percentage - a.percentage); // Ordenar do maior para o menor

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Sentimento das Notícias</h3>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {isLoadingSentiment ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      ) : sentimentData.every(item => item.value === 0) ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhum dado encontrado</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] relative">
          <div className="flex items-center justify-center w-full relative">
            <div className="w-60 h-60 relative rounded-full overflow-hidden">
              <div
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(${gradientString})`,
                  borderRadius: '50%',
                }}
              />
            </div>
            <div className="ml-8 flex flex-col gap-2">
              {percentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{Math.round(item.percentage)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            {sentimentData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1 relative">
                {item.name === 'Neutro' && (
                  <div
                    className="absolute w-0 h-0"
                    style={{
                      top: '-150px', // Metade da altura do gráfico (h-60 = 240px / 2 = 120px) + margem
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentoNoticias;