import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowRight, 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  BarChart as BarChartIcon,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/charts/AreaChart';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DateRangePicker from '@/components/DateRangePicker';

// Mock data (manteremos apenas para os outros gráficos por enquanto)
const lineChartData = [
  { name: '01/05', notícias: 40 },
  { name: '02/05', notícias: 30 },
  { name: '03/05', notícias: 35 },
  { name: '04/05', notícias: 55 },
  { name: '05/05', notícias: 25 },
  { name: '06/05', notícias: 40 },
  { name: '07/05', notícias: 45 },
  { name: '08/05', notícias: 60 },
  { name: '09/05', notícias: 35 },
  { name: '10/05', notícias: 50 },
  { name: '11/05', notícias: 45 },
  { name: '12/05', notícias: 40 },
  { name: '13/05', notícias: 55 },
  { name: '14/05', notícias: 70 },
];

const sentimentData = [
  { name: 'Positivo', value: 42, color: '#CAF10A' },
  { name: 'Neutro', value: 38, color: '#AEAEAE' },
  { name: 'Negativo', value: 20, color: '#FF4D4D' },
];

const Dashboard = () => {
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [areaChartData, setAreaChartData] = useState([]);
  const [totalPontuacao, setTotalPontuacao] = useState(0);
  const [portaisRelevantes, setPortaisRelevantes] = useState({ top5: [], bottom5: [] });
  const [selectedType, setSelectedType] = useState('positivas');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 dias
    to: new Date(),
  });

  useEffect(() => {
    const from = dateRange.from?.toISOString().split('T')[0];
    const to = dateRange.to?.toISOString().split('T')[0];

    if (from && to) {
      setIsLoading(true);

      // Buscar total de notícias
      fetch(`https://smi-api-production-fae2.up.railway.app/metrics?type=total-noticias&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
          console.log('Dados de total de notícias recebidos da API:', data);
          setTotalNoticias(data.total_noticias || 0);
        })
        .catch(error => console.error('Erro ao buscar total de notícias:', error));

      // Buscar dados para o gráfico de área
      fetch(`https://smi-api-production-fae2.up.railway.app/metrics?type=noticias-por-periodo&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
          console.log('Dados brutos do gráfico recebidos da API:', data);
          const formattedData = data.map(item => ({
            name: format(new Date(item.name), 'dd/MMM', { locale: ptBR }).toLowerCase(),
            value: item.value
          }));
          console.log('Dados formatados do gráfico:', formattedData);
          setAreaChartData(formattedData);
        })
        .catch(error => console.error('Erro ao buscar dados do gráfico:', error));

      // Buscar total de pontuação
      fetch(`https://smi-api-production-fae2.up.railway.app/pontuacao-total?from=${from}&to=${to}`)
        .then(response => response.json())
        .then(data => {
          console.log('Dados de pontuação total recebidos da API:', data);
          setTotalPontuacao(data.total_pontuacao || 0);
        })
        .catch(error => console.error('Erro ao buscar pontuação total:', error));

      // Buscar portais relevantes
      fetch(`https://smi-api-production-fae2.up.railway.app/portais-relevantes?from=${from}&to=${to}&type=${selectedType}`)
        .then(response => response.json())
        .then(data => {
          console.log(`Dados de portais relevantes (${selectedType}) recebidos da API:`, data);
          setPortaisRelevantes(data);
        })
        .catch(error => console.error('Erro ao buscar portais relevantes:', error))
        .finally(() => setIsLoading(false));
    }
  }, [dateRange, selectedType]);

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Visão geral do monitoramento de imprensa</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <DateRangePicker onChange={handleDateRangeChange} />
            
            <button className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover">
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total de Notícias" 
            value={isLoading ? "..." : totalNoticias.toString()} 
            change="+12.5% em relação ao mês anterior" 
            isPositive 
            icon={<Newspaper className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Notícias Positivas" 
            value="527" 
            change="+8.2% em relação ao mês anterior" 
            isPositive 
            icon={<TrendingUp className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Notícias Negativas" 
            value="251" 
            change="-5.3% em relação ao mês anterior" 
            isPositive 
            icon={<TrendingDown className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Pontuação" 
            value={isLoading ? "..." : totalPontuacao.toString()} 
            change="+15.8% em relação ao mês anterior" 
            isPositive 
            icon={<BarChartIcon className="h-6 w-6" />} 
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Notícias por Período</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Carregando dados...</p>
              </div>
            ) : (
              <AreaChart data={areaChartData} height={300} gradientColor="#CAF10A" />
            )}
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Portais Relevantes</h3>
              <div className="flex items-center gap-2">
                <select 
                  className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <option value="positivas">Positivas</option>
                  <option value="negativas">Negativas</option>
                </select>
                <button className="p-1 hover:bg-white/5 rounded-full">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Carregando dados...</p>
              </div>
            ) : selectedType === 'negativas' && portaisRelevantes.bottom5.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400">Nenhuma notícia encontrada</p>
              </div>
            ) : (
              <BarChart 
                data={selectedType === 'positivas' ? portaisRelevantes.top5 : portaisRelevantes.bottom5}
                height={300}
                yAxisKey="value"
                barColor={selectedType === 'positivas' ? '#CAF10A' : '#FF4D4D'} // Cor condicional
              />
            )}
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="dashboard-card lg:col-span-2">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Evolução de Notícias</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <LineChart 
              data={lineChartData} 
              height={300} 
              lineColor="#CAF10A" 
              yAxisKey="notícias" 
            />
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Sentimento das Notícias</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-[300px]">
              <div className="w-48 h-48 relative rounded-full overflow-hidden mb-6">
                {sentimentData.map((item, index) => (
                  <div 
                    key={index}
                    className="absolute"
                    style={{
                      width: '100%',
                      height: '100%',
                      clip: `rect(0, ${48 * 2}px, ${48 * 2}px, ${48}px)`,
                      transform: `rotate(${index * 120}deg)`,
                      transformOrigin: 'center',
                      background: `conic-gradient(transparent ${index * (360 / sentimentData.length)}deg, ${item.color} ${index * (360 / sentimentData.length)}deg ${(index + 1) * (360 / sentimentData.length)}deg, transparent ${(index + 1) * (360 / sentimentData.length)}deg)`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-dark-card rounded-full h-32 w-32 flex items-center justify-center">
                    <span className="text-xl font-bold">42%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;