import React, { useState, useEffect } from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import StatCard from '../StatCard';

interface PontuacaoProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const Pontuacao: React.FC<PontuacaoProps> = ({ dateRange }) => {
  const [totalPontuacao, setTotalPontuacao] = useState(0);
  const [isLoadingPontuacao, setIsLoadingPontuacao] = useState(true);

  const totalPontuacaoMemo = React.useMemo(() => {
    console.log('Memoizando totalPontuacao:', totalPontuacao);
    return totalPontuacao;
  }, [totalPontuacao]);

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      const startTimePontuacao = Date.now();
      fetch(`https://smi-api-production-fae2.up.railway.app/dashboard/pontuacao-por-periodo?dataInicio=${from}&dataFim=${to}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados de pontuação por período recebidos da API:', data);
          const total = data.reduce((sum: number, item: { pontuacao: number }) => sum + (item.pontuacao || 0), 0) || totalPontuacaoMemo; // Usa valor anterior se array vazio
          console.log('Total de pontuação calculado:', total);
          console.log(`Tempo para buscar pontuação por período: ${(Date.now() - startTimePontuacao) / 1000} segundos`);
          setTotalPontuacao(total);
        })
        .catch(error => {
          console.error('Erro ao buscar pontuação por período:', error.message);
          setTotalPontuacao(totalPontuacaoMemo); // Mantém o valor anterior em caso de erro
        })
        .finally(() => {
          setIsLoadingPontuacao(false);
        });
    }
  }, [dateRange]);

  return (
    <StatCard
      title="Pontuação"
      value={isLoadingPontuacao ? "..." : totalPontuacaoMemo.toString()}
      change="+15.8% em relação ao mês anterior"
      isPositive
      icon={<BarChartIcon className="h-6 w-6" />}
    />
  );
};

export default Pontuacao;