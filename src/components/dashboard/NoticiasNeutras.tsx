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
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/noticias-neutras?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de notícias neutras recebidos da API:', data);
          const total = data.total || (data.length === 0 ? totalNoticiasNeutrasMemo : 0); // Mantém o valor anterior se vazio
          console.log(`Tempo para buscar notícias neutras: ${(Date.now() - startTimeNoticiasNeutras) / 1000} segundos`);
          setTotalNoticiasNeutras(total);
        })
        .catch(error => {
          console.error('Erro ao buscar notícias neutras:', error.message);
          setTotalNoticiasNeutras(totalNoticiasNeutrasMemo); // Mantém o valor anterior em caso de erro
        })
        .finally(() => {
          setIsLoadingNoticiasNeutras(false);
        });
    }
  }, [dateRange]);

  return (
    <StatCard
      title="Notícias Neutras"
      value={isLoadingNoticiasNeutras ? "..." : totalNoticiasNeutrasMemo.toString()}
      isPositive={false} // Neutras não são positivas nem negativas
      icon={<Meh className="text-[#9ca3af]" />}
    />
  );
};

export default NoticiasNeutras;