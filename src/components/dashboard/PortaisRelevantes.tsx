import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
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
          setPortaisData({
            top5: selectedType === 'positivas' ? data : [],
            bottom5: selectedType === 'negativas' ? data : [],
          });
        })
        .catch(error => {
          console.error('Erro ao buscar portais relevantes:', error.message);
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
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>{`Portal: ${label}`}</p>
          <p style={{ color: '#fff', margin: 0 }}>{`Pontuação: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-[#fde047] hover:text-[#fef08a] transition-colors mr-2" />
          <h3 className="text-lg font-medium">Portais Relevantes</h3>
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
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      ) : selectedType === 'negativas' && portaisData.bottom5.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhuma notícia encontrada</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">Nenhum dado disponível para exibição</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="portal"
              stroke="#888"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#888" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
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
              barSize={30}
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