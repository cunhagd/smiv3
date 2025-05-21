import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Frown } from 'lucide-react';
import StatCard from '../StatCard';

interface NoticiasNegativasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const NoticiasNegativas: React.FC<NoticiasNegativasProps> = ({ dateRange }) => {
  const [totalNoticiasNegativas, setTotalNoticiasNegativas] = useState(0);
  const [sentimentTotals, setSentimentTotals] = useState({ positivas: 0, neutras: 0, negativas: 0 });
  const [isLoadingNoticiasNegativas, setIsLoadingNoticiasNegativas] = useState(true);

  const totalNoticiasNegativasMemo = React.useMemo(() => {
    console.log('Memoizando totalNoticiasNegativas:', totalNoticiasNegativas);
    return totalNoticiasNegativas;
  }, [totalNoticiasNegativas]);

  useEffect(() => {
    console.log('Total de Notícias Negativas atualizado na UI:', totalNoticiasNegativas);
  }, [totalNoticiasNegativas]);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeNoticiasNegativas = Date.now();
      // Fetch para sentimento-noticias
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

          // Fetch específico para notícias negativas
          return fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-negativas?dataInicio=${from}&dataFim=${to}`);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de notícias negativas recebidos da API:', data);
          console.log(`Tempo para buscar notícias negativas: ${(Date.now() - startTimeNoticiasNegativas) / 1000} segundos`);
          setTotalNoticiasNegativas(data.total || 0);
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error.message);
        })
        .finally(() => {
          setIsLoadingNoticiasNegativas(false);
        });
    }
  }, [dateRange]);

  // Calcular o percentual de notícias negativas
  const total = sentimentTotals.positivas + sentimentTotals.neutras + sentimentTotals.negativas;
  const percentage = total > 0 ? (sentimentTotals.negativas / total) * 100 : 0;

  return (
    <StatCard
      title="Notícias Negativas"
      value={isLoadingNoticiasNegativas ? "..." : totalNoticiasNegativasMemo.toString()}
      isPositive
      icon={<Frown className="text-[#f87171]" />}
    >
      {!isLoadingNoticiasNegativas && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-[#f87171] font-medium">{Math.round(percentage)}%</span>
          <span className="text-xs text-gray-400">do total</span>
        </div>
      )}
    </StatCard>
  );
};

export default NoticiasNegativas;