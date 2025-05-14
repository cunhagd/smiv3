import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';

interface GraficoCategoriaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

const GraficoCategoria: React.FC<GraficoCategoriaProps> = ({ dateRange }) => {
  const [categoriaData, setCategoriaData] = useState<any[]>([]);
  const [isLoadingCategoria, setIsLoadingCategoria] = useState(true);

  useEffect(() => {
    const fetchCategoriaData = async () => {
      setIsLoadingCategoria(true);
      try {
        const defaultFrom = new Date();
        const defaultTo = new Date();
        const dataInicio = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(defaultFrom, 'yyyy-MM-dd');
        const dataFim = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(defaultTo, 'yyyy-MM-dd');
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/dashboard/dash-estrategica?dataInicio=${dataInicio}&dataFim=${dataFim}`
        );
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de categorias');
        }
        const data = await response.json();
        const temas = data['dash-estrategica'][0]['total-noticias-tema'] || [];
        
        // Mapear os dados da API para o formato do gráfico
        const chartData = temas.map((item: any) => {
          const parsedDate = parse(item.data, 'yyyy-MM-dd', new Date());
          if (!isValid(parsedDate)) {
            console.warn(`Data inválida recebida da API: ${item.data}`);
            return null;
          }
          return {
            data: item.data,
            educacao: item['total-educacao'] || 0,
            saude: item['total-saude'] || 0,
            infraestrutura: item['total-infraestrutura'] || 0,
            social: item['total-social'] || 0,
          };
        }).filter((item: any) => item !== null);

        setCategoriaData(chartData);
        console.log(`Dados de categorias fetched for ${dataInicio} to ${dataFim}:`, chartData);
      } catch (error: any) {
        console.error('Erro ao buscar dados de categorias:', error.message);
        setCategoriaData([]);
      } finally {
        setIsLoadingCategoria(false);
      }
    };

    fetchCategoriaData();
  }, [dateRange]);

  const chartData = categoriaData.map(item => {
    const parsedDate = parse(item.data, 'yyyy-MM-dd', new Date());
    return {
      name: format(parsedDate, 'dd/MM', { locale: ptBR }),
      educacao: item.educacao,
      saude: item.saude,
      infraestrutura: item.infraestrutura,
      social: item.social,
    };
  });

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="text-lg font-medium">Notícias por Categoria</h3>
        <button className="p-1 hover:bg-white/5 rounded-full">
          <ArrowRight className="h-4 w-4 text-[#fde047] hover:text-[#fef08a] transition-colors" />
        </button>
      </div>
      {isLoadingCategoria ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      ) : chartData.length === 0 || chartData.every(item => item.educacao === 0 && item.saude === 0 && item.infraestrutura === 0 && item.social === 0) ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhum dado encontrado</p>
        </div>
      ) : (
        <LineChart
          data={chartData}
          height={300}
          yAxisKey={['educacao', 'saude', 'infraestrutura', 'social']}
          lineColors={['#66ffdb', '#478EFF', '#ffbf87', '#E3D9FF']}
          lineLabels={['Educação', 'Saúde', 'Infraestrutura', 'Social']}
        />
      )}
    </div>
  );
};

export default GraficoCategoria;