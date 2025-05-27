import { useState, useEffect, useMemo } from 'react'; // Importar apenas hooks necessários
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '../StatCard';

interface PontuacaoSemanaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

const PontuacaoSemana: React.FC<PontuacaoSemanaProps> = ({ dateRange }) => {
  const [totalPontuacao, setTotalPontuacao] = useState(0);
  const [isLoadingPontuacao, setIsLoadingPontuacao] = useState(true);

  const totalPontuacaoMemo = useMemo(() => {
    console.log('Memoizando totalPontuacao para Semana Estratégica:', totalPontuacao);
    return totalPontuacao;
  }, [totalPontuacao]);

  useEffect(() => {
    const fetchPontuacao = async () => {
      setIsLoadingPontuacao(true);
      try {
        const defaultFrom = new Date();
        const defaultTo = new Date();
        const dataInicio = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(defaultFrom, 'yyyy-MM-dd');
        const dataFim = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(defaultTo, 'yyyy-MM-dd');
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/dashboard/dash-estrategica?dataInicio=${dataInicio}&dataFim=${dataFim}`
        );
        if (!response.ok) {
          throw new Error('Falha ao buscar pontuação estratégica');
        }
        const data = await response.json();
        const pontuacao = data['dash-estrategica'][0]['total-pontuacao-estratégicas'] || 0;
        setTotalPontuacao(pontuacao);
        console.log(`Pontuação fetched for ${dataInicio} to ${dataFim}: ${pontuacao}`);
      } catch (error: any) {
        console.error('Erro ao buscar pontuação:', error.message);
        setTotalPontuacao(0);
      } finally {
        setIsLoadingPontuacao(false);
      }
    };

    fetchPontuacao();
  }, [dateRange]);

  return (
    <StatCard
      title="Pontuação Semana Estratégica"
      value={isLoadingPontuacao ? "..." : totalPontuacaoMemo.toString()}
      isPositive
      icon={<Trophy className="h-6 w-6 text-[#fde047] hover:text-[#fef08a] transition-colors" />}
    />
  );
};

export default PontuacaoSemana;