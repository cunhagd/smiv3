import { useState, useEffect, useMemo } from 'react'; // Importar apenas hooks necessários
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '../StatCard';

interface TotalNoticiasSemanaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

const TotalNoticiasSemana: React.FC<TotalNoticiasSemanaProps> = ({ dateRange }) => {
  const [totalNoticias, setTotalNoticias] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalNoticiasMemo = useMemo(() => {
    console.log('Memoizando totalNoticias para Semana Estratégica:', totalNoticias);
    return totalNoticias;
  }, [totalNoticias]);

  useEffect(() => {
    const fetchTotalNoticias = async () => {
      setIsLoading(true);
      try {
        const defaultFrom = new Date();
        const defaultTo = new Date();
        const dataInicio = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(defaultFrom, 'yyyy-MM-dd');
        const dataFim = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(defaultTo, 'yyyy-MM-dd');
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/dashboard/dash-estrategica?dataInicio=${dataInicio}&dataFim=${dataFim}`
        );
        if (!response.ok) {
          throw new Error('Falha ao buscar total de notícias estratégicas');
        }
        const data = await response.json();
        const total = data['dash-estrategica'][0]['total-noticias-estratégicas'] || 0;
        setTotalNoticias(total);
        console.log(`Total notícias fetched for ${dataInicio} to ${dataFim}: ${total}`);
      } catch (error: any) {
        console.error('Erro ao buscar total de notícias:', error.message);
        setTotalNoticias(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalNoticias();
  }, [dateRange]);

  return (
    <StatCard
      title="Total de Notícias Estratégicas"
      value={isLoading ? "..." : totalNoticiasMemo.toString()}
      isPositive
      icon={<Sparkles className="h-6 w-6 text-[#fde047] hover:text-[#fef08a] transition-colors" />}
    />
  );
};

export default TotalNoticiasSemana;