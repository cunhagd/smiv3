import { useState, useEffect, useMemo } from 'react'; // Importar apenas hooks necessários
import { Sparkles } from 'lucide-react'; // Corrigido para Sparkles (conforme integração anterior)
import StatCard from '../StatCard';

interface SemanasCadastradasProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

const SemanasCadastradas: React.FC<SemanasCadastradasProps> = ({ dateRange }) => {
  const [totalSemanas, setTotalSemanas] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalSemanasMemo = useMemo(() => {
    console.log('Memoizando totalSemanas para Semana Estratégica:', totalSemanas);
    return totalSemanas;
  }, [totalSemanas]);

  useEffect(() => {
    const fetchTotalSemanas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://smi-api-production-fae2.up.railway.app/semana-estrategica'
        );
        if (!response.ok) {
          throw new Error('Falha ao buscar total de semanas estratégicas');
        }
        const data = await response.json();
        const total = data.length || 0;
        setTotalSemanas(total);
        console.log(`Total semanas fetched: ${total}`);
      } catch (error: any) {
        console.error('Erro ao buscar total de semanas:', error.message);
        setTotalSemanas(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalSemanas();
  }, []); // No dependency on dateRange since API doesn't use it

  return (
    <StatCard
      title="Total de Semanas Cadastradas"
      value={isLoading ? "..." : totalSemanasMemo.toString()}
      isPositive
      icon={<Sparkles className="h-6 w-6 text-[#fde047] hover:text-[#fef08a] transition-colors" />}
    />
  );
};

export default SemanasCadastradas;