import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Turtle } from 'lucide-react';

interface PortaisRelevantesProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  } | undefined;
}

const PortaisRelevantes: React.FC<PortaisRelevantesProps> = ({ dateRange }) => {
  const [portaisData, setPortaisData] = useState({ top5: [], bottom5: [] });
  const [selectedType, setSelectedType] = useState('positivas');
  const [isLoadingPortais, setIsLoadingPortais] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Definindo as cores para Positivas, Neutras e Negativas
  const sentimentColors = {
    Positivas: '#CAF10A',
    Neutras: '#AEAEAE',
    Negativas: '#FF4D4D',
  };

  useEffect(() => {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    const from = dateRange?.from?.toISOString().split('T')[0] || defaultFrom.toISOString().split('T')[0];
    const to = dateRange?.to?.toISOString().split('T')[0] || defaultTo.toISOString().split('T')[0];

    if (from && to) {
      setIsLoadingPortais(true);
      const apiUrl = selectedType === 'positivas'
        ? `https://smi-api-production-fae2.up.railway.app/dashboard/portais-relevantes-positivas?dataInicio=${from}&dataFim=${to}`
        : `https://smi-api-production-fae2.up.railway.app/dashboard/portais-relevantes-negativas?dataInicio=${from}&dataFim=${to}`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Dados de portais relevantes (${selectedType}) recebidos da API:`, data);
          const formattedData = Array.isArray(data)
            ? data.map(item => ({
                portal: item.portal || 'Desconhecido',
                pontuacao: item.pontuacao || 0,
                quantidade: item.quantidade || 0,
                positivo: item.positivo || 0,
                negativo: item.negativo || 0,
                neutro: item.neutro || 0,
                '%positivo': item['%positivo'] || '0%',
                '%negativo': item['%negativo'] || '0%',
                '%neutro': item['%neutro'] || '0%',
              })).slice(0, 5) // Limitar a 5 portais
            : [];
          setPortaisData({
            top5: selectedType === 'positivas' ? formattedData : [],
            bottom5: selectedType === 'negativas' ? formattedData : [],
          });
        })
        .catch(error => {
          console.error('Erro ao buscar portais relevantes:', error.message);
          setPortaisData({ top5: [], bottom5: [] });
        })
        .finally(() => {
          setIsLoadingPortais(false);
        });
    }
  }, [dateRange, selectedType]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const chartData = selectedType === 'positivas' ? portaisData.top5 : portaisData.bottom5;
  const barColor = selectedType === 'positivas' ? '#CAF10A' : '#FF4D4D';

  console.log('Dados do gráfico (chartData):', chartData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      // Preparar os dados para o gráfico de pizza
      const sentimentData = [
        { name: 'Positivo', value: parseFloat(data['%positivo']) || 0, color: sentimentColors.Positivas },
        { name: 'Neutro', value: parseFloat(data['%neutro']) || 0, color: sentimentColors.Neutras },
        { name: 'Negativo', value: parseFloat(data['%negativo']) || 0, color: sentimentColors.Negativas },
      ];

      // Calcular o total de percentuais
      const total = sentimentData.reduce((acc, item) => acc + item.value, 0);

      // Calcular os ângulos acumulados para o gráfico de pizza
      let accumulatedAngle = 0;
      const gradientStops = sentimentData.map(item => {
        const proportion = total > 0 ? item.value / total : 0;
        const angle = proportion * 360;
        const startAngle = accumulatedAngle;
        accumulatedAngle += angle;
        return { color: item.color, startAngle, endAngle: accumulatedAngle };
      });

      // Gerar a string de conic-gradient
      const gradientString = gradientStops
        .map(({ color, startAngle, endAngle }) => `${color} ${startAngle}deg ${endAngle}deg`)
        .join(', ');

      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 6px 0', fontSize: '12px' }}><strong>Portal:</strong> {label}</p>
          <p style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '12px' }}><strong>Pontuação:</strong> {data.pontuacao}</p>
          {/* Contêiner flex para os valores, gráfico e percentuais */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Coluna dos valores numéricos */}
            <div style={{ fontSize: '12px' }}>
              <p style={{ color: sentimentColors.Positivas, margin: '0 0 4px 0' }}>Positivas: {data.positivo}</p>
              <p style={{ color: sentimentColors.Negativas, margin: '0 0 4px 0' }}>Negativas: {data.negativo}</p>
              <p style={{ color: sentimentColors.Neutras, margin: '0 0 4px 0' }}>Neutras: {data.neutro}</p>
              <p style={{ color: '#fff', margin: '0 0 4px 0' }}><strong>Total: </strong>{data.quantidade}</p>
            </div>
            {/* Gráfico de Pizza */}
            <div className="w-16 h-16 relative rounded-full overflow-hidden">
              <div
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(${gradientString})`,
                  borderRadius: '50%',
                }}
              />
            </div>
            {/* Coluna dos percentuais com inline blocks à esquerda */}
            <div style={{ fontSize: '12px' }}>
              <p style={{ color: sentimentColors.Positivas, margin: '0 0 4px 0' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: sentimentColors.Positivas, marginRight: '4px' }}></span>
                {data['%positivo']}
              </p>
              <p style={{ color: sentimentColors.Negativas, margin: '0 0 4px 0' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: sentimentColors.Negativas, marginRight: '4px' }}></span>
                {data['%negativo']}
              </p>
              <p style={{ color: sentimentColors.Neutras, margin: '0 0 4px 0' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: sentimentColors.Neutras, marginRight: '4px' }}></span>
                {data['%neutro']}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Portais Relevantes por Pontuação</h3>
        </div>
        <select
          className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="positivas">Positivas</option>
          <option value="negativas">Negativas</option>
        </select>
      </div>
      {isLoadingPortais ? (
        <div className="flex items-center justify-center h-[300px]">
          <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhum dado disponível para exibição</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="portal"
              stroke="#888"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#888"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              domain={['auto', 0]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={barColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={barColor} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Bar
              dataKey="pontuacao"
              barSize={20} // Reduzido para caber no espaço menor
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="url(#colorBar)"
                  opacity={hoveredBar === entry.portal ? 1 : 0.8}
                  onMouseEnter={() => setHoveredBar(entry.portal)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortaisRelevantes;