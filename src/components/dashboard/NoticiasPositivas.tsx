import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Smile } from 'lucide-react';
import StatCard from '../StatCard';

interface NoticiasPositivasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const NoticiasPositivas: React.FC<NoticiasPositivasProps> = ({ dateRange }) => {
  const [totalNoticiasPositivas, setTotalNoticiasPositivas] = useState(0);
  const [sentimentTotals, setSentimentTotals] = useState({ positivas: 0, neutras: 0, negativas: 0 });
  const [isLoadingNoticiasPositivas, setIsLoadingNoticiasPositivas] = useState(true);

  const totalNoticiasPositivasMemo = React.useMemo(() => {
    console.log('Memoizando totalNoticiasPositivas:', totalNoticiasPositivas);
    return totalNoticiasPositivas;
  }, [totalNoticiasPositivas]);

  useEffect(() => {
    console.log('Total de Notícias Positivas atualizado na UI:', totalNoticiasPositivas);
  }, [totalNoticiasPositivas]);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeNoticiasPositivas = Date.now();
      // Fetch para sentimento-noticias (igual ao SentimentoNoticias)
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/sentimento-noticias?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          const totals = data.reduce(
            (acc, item) => {
              acc.positivas += item.positivas || 0;
              acc.negativas += item.negativas || 0;
              acc.neutras += item.neutras || 0;
              return acc;
            },
            { positivas: 0, negativas: 0, neutras: 0 }
          );
          setSentimentTotals(totals);

          // Fetch específico para notícias positivas
          return fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-positivas?dataInicio=${from}&dataFim=${to}`);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de notícias positivas recebidos da API:', data);
          const total = data.total || (data.length === 0 ? totalNoticiasPositivasMemo : 0);
          console.log(`Tempo para buscar notícias positivas: ${(Date.now() - startTimeNoticiasPositivas) / 1000} segundos`);
          setTotalNoticiasPositivas(total);
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error.message);
          setTotalNoticiasPositivas(totalNoticiasPositivasMemo);
        })
        .finally(() => {
          setIsLoadingNoticiasPositivas(false);
        });
    }
  }, [dateRange, totalNoticiasPositivasMemo]);

  // Calcular o percentual de notícias positivas
  const total = sentimentTotals.positivas + sentimentTotals.neutras + sentimentTotals.negativas;
  const percentage = total > 0 ? (sentimentTotals.positivas / total) * 100 : 0;

  return (
    <StatCard
      title="Notícias Positivas"
      value={isLoadingNoticiasPositivas ? "..." : totalNoticiasPositivasMemo.toString()}
      isPositive
      icon={<Smile className="text-[#34d399]" />}
    >
      {!isLoadingNoticiasPositivas && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-[#34d399] font-medium">{Math.round(percentage)}%</span>
          <span className="text-xs text-gray-400">do total</span>
        </div>
      )}
    </StatCard>
  );
};

export default NoticiasPositivas;