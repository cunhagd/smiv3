import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meh } from 'lucide-react';
import StatCard from '../StatCard';

interface NoticiasNeutrasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const NoticiasNeutras: React.FC<NoticiasNeutrasProps> = ({ dateRange }) => {
  const [totalNoticiasNeutras, setTotalNoticiasNeutras] = useState(0);
  const [sentimentTotals, setSentimentTotals] = useState({ positivas: 0, neutras: 0, negativas: 0 });
  const [isLoadingNoticiasNeutras, setIsLoadingNoticiasNeutras] = useState(true);

  const totalNoticiasNeutrasMemo = React.useMemo(() => {
    console.log('Memoizando totalNoticiasNeutras:', totalNoticiasNeutras);
    return totalNoticiasNeutras;
  }, [totalNoticiasNeutras]);

  useEffect(() => {
    console.log('Total de Notícias Neutras atualizado na UI:', totalNoticiasNeutras);
  }, [totalNoticiasNeutras]);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeNoticiasNeutras = Date.now();
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

          // Fetch específico para notícias neutras
          return fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-neutras?dataInicio=${from}&dataFim=${to}`);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de notícias neutras recebidos da API:', data);
          const total = data.total || (data.length === 0 ? totalNoticiasNeutrasMemo : 0);
          console.log(`Tempo para buscar notícias neutras: ${(Date.now() - startTimeNoticiasNeutras) / 1000} segundos`);
          setTotalNoticiasNeutras(total);
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error.message);
          setTotalNoticiasNeutras(totalNoticiasNeutrasMemo);
        })
        .finally(() => {
          setIsLoadingNoticiasNeutras(false);
        });
    }
  }, [dateRange, totalNoticiasNeutrasMemo]);

  // Calcular o percentual de notícias neutras
  const total = sentimentTotals.positivas + sentimentTotals.neutras + sentimentTotals.negativas;
  const percentage = total > 0 ? (sentimentTotals.neutras / total) * 100 : 0;

  return (
    <StatCard
      title="Notícias Neutras"
      value={isLoadingNoticiasNeutras ? "..." : totalNoticiasNeutrasMemo.toString()}
      isPositive={false}
      icon={<Meh className="text-[#9ca3af]" />}
    >
      {!isLoadingNoticiasNeutras && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-[#9ca3af] font-medium">{Math.round(percentage)}%</span>
          <span className="text-xs text-gray-400">do total</span>
        </div>
      )}
    </StatCard>
  );
};

export default NoticiasNeutras;