import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Newspaper } from 'lucide-react';
import StatCard from '../StatCard';

interface TotalNoticiasProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const TotalNoticias: React.FC<TotalNoticiasProps> = ({ dateRange }) => {
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [isLoadingNoticias, setIsLoadingNoticias] = useState(true);

  const totalNoticiasMemo = React.useMemo(() => {
    console.log('Memoizando totalNoticias:', totalNoticias);
    return totalNoticias;
  }, [totalNoticias]);

  useEffect(() => {
    console.log('Total de Notícias atualizado na UI:', totalNoticias);
  }, [totalNoticias]);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimeNoticias = Date.now();
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-total?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de total de notícias recebidos da API:', data);
          const total = data.total || (data.length === 0 ? totalNoticiasMemo : 0); // Mantém o valor anterior se vazio
          console.log(`Tempo para buscar total de notícias: ${(Date.now() - startTimeNoticias) / 1000} segundos`);
          setTotalNoticias(total);
        })
        .catch(error => {
          console.error('Erro ao buscar total de notícias:', error.message);
          setTotalNoticias(totalNoticiasMemo); // Mantém o valor anterior em caso de erro
        })
        .finally(() => {
          setIsLoadingNoticias(false);
        });
    }
  }, [dateRange]);

  return (
    <StatCard
      title="Total de Notícias"
      value={isLoadingNoticias ? "..." : totalNoticiasMemo.toString()}
      isPositive
      icon={<Newspaper className="h-6 w-6" />}
    />
  );
};

export default TotalNoticias;