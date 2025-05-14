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
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-positivas?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de notícias positivas recebidos da API:', data);
          const total = data.total || (data.length === 0 ? totalNoticiasPositivasMemo : 0); // Mantém o valor anterior se vazio
          console.log(`Tempo para buscar notícias positivas: ${(Date.now() - startTimeNoticiasPositivas) / 1000} segundos`);
          setTotalNoticiasPositivas(total);
        })
        .catch(error => {
          console.error('Erro ao buscar notícias positivas:', error.message);
          setTotalNoticiasPositivas(totalNoticiasPositivasMemo); // Mantém o valor anterior em caso de erro
        })
        .finally(() => {
          setIsLoadingNoticiasPositivas(false);
        });
    }
  }, [dateRange]);

  return (
    <StatCard
      title="Notícias Positivas"
      value={isLoadingNoticiasPositivas ? "..." : totalNoticiasPositivasMemo.toString()}
      isPositive
      icon={<Smile className="text-[#34d399]" />}
    />
  );
};

export default NoticiasPositivas;