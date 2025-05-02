import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp } from 'lucide-react';
import StatCard from '../StatCard';

interface NoticiasNegativasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const NoticiasNegativas: React.FC<NoticiasNegativasProps> = ({ dateRange }) => {
  const [totalNoticiasNegativas, setTotalNoticiasNegativas] = useState(0);
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
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-negativas?dataInicio=${from}&dataFim=${to}`)
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
          console.error('Erro ao buscar notícias negativas:', error.message);
        })
        .finally(() => {
          setIsLoadingNoticiasNegativas(false);
        });
    }
  }, [dateRange]);

  return (
    <StatCard
      title="Notícias negativas"
      value={isLoadingNoticiasNegativas ? "..." : totalNoticiasNegativasMemo.toString()}
      change="+8.2% em relação ao mês anterior"
      isPositive
      icon={<TrendingUp className="h-6 w-6" />}
    />
  );
};

export default NoticiasNegativas;