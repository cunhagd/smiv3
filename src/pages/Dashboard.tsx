import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  BarChart as BarChartIcon,
  Filter,
  Download
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/charts/AreaChart';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DateRangePicker from '@/components/DateRangePicker';

// Mock data (manteremos por enquanto para os gráficos)
const areaChartData = [
  { name: 'Jan', value: 45 },
  { name: 'Fev', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Abr', value: 55 },
  { name: 'Mai', value: 58 },
  { name: 'Jun', value: 45 },
  { name: 'Jul', value: 70 },
  { name: 'Ago', value: 25 },
  { name: 'Set', value: 32 },
  { name: 'Out', value: 43 },
  { name: 'Nov', value: 60 },
  { name: 'Dez', value: 64 },
];

const barChartData = [
  { name: 'TV', positivo: 25, negativo: -10, neutro: 15 },
  { name: 'Jornal', positivo: 40, negativo: -15, neutro: 20 },
  { name: 'Rádio', positivo: 30, negativo: -20, neutro: 10 },
  { name: 'Internet', positivo: 55, negativo: -25, neutro: 25 },
  { name: 'Blog', positivo: 15, negativo: -5, neutro: 10 },
];

const lineChartData = [
  { name: '01/05', menções: 40 },
  { name: '02/05', menções: 30 },
  { name: '03/05', menções: 35 },
  { name: '04/05', menções: 55 },
  { name: '05/05', menções: 25 },
  { name: '06/05', menções: 40 },
  { name: '07/05', menções: 45 },
  { name: '08/05', menções: 60 },
  { name: '09/05', menções: 35 },
  { name: '10/05', menções: 50 },
  { name: '11/05', menções: 45 },
  { name: '12/05', menções: 40 },
  { name: '13/05', menções: 55 },
  { name: '14/05', menções: 70 },
];

const sentimentData = [
  { name: 'Positivo', value: 42, color: '#CAF10A' },
  { name: 'Neutro', value: 38, color: '#AEAEAE' },
  { name: 'Negativo', value: 20, color: '#FF4D4D' },
];

const Dashboard = () => {
  const [totalMencoes, setTotalMencoes] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  useEffect(() => {
    fetch('https://smi-api-production-fae2.up.railway.app/metrics') // Domínio real da sua API
      .then(response => response.json())
      .then(data => {
        console.log('Dados recebidos da API:', data); // Adiciona log para debug
        setTotalMencoes(data.total_mencoes || 0);
      })
      .catch(error => console.error('Erro ao buscar total de menções:', error));
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // Aqui você poderia fazer uma nova chamada à API com as datas selecionadas
    console.log('Novo período selecionado:', range);
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
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filtros</span>
            </button>
            
            <button className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover">
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total de Menções" 
            value={totalMencoes.toString()} 
            change="+12.5% em relação ao mês anterior" 
            isPositive 
            icon={<Newspaper className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Menções Positivas" 
            value="527" 
            change="+8.2% em relação ao mês anterior" 
            isPositive 
            icon={<TrendingUp className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Menções Negativas" 
            value="251" 
            change="-5.3% em relação ao mês anterior" 
            isPositive 
            icon={<TrendingDown className="h-6 w-6" />} 
          />
          
          <StatCard 
            title="Alcance Estimado" 
            value="2.7M" 
            change="+15.8% em relação ao mês anterior" 
            isPositive 
            icon={<BarChartIcon className="h-6 w-6" />} 
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Menções por Período</h3>
              <div className="flex items-center gap-2">
                <select className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm">
                  <option>Mensal</option>
                  <option>Semanal</option>
                  <option>Diário</option>
                </select>
                <button className="p-1 hover:bg-white/5 rounded-full">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <AreaChart data={areaChartData} height={300} gradientColor="#CAF10A" />
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Menções por Mídia</h3>
              <div className="flex items-center gap-2">
                <select className="bg-dark-card border border-white/10 rounded-lg p-1 text-sm">
                  <option>Total</option>
                  <option>Positivas</option>
                  <option>Negativas</option>
                </select>
                <button className="p-1 hover:bg-white/5 rounded-full">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <BarChart 
              data={barChartData} 
              height={300} 
              yAxisKey="positivo" 
            />
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="dashboard-card lg:col-span-2">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Evolução de Menções</h3>
              <button className="p-1 hover:bg-white/5 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <LineChart 
              data={lineChartData} 
              height={300} 
              lineColor="#CAF10A" 
              yAxisKey="menções" 
            />
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">Sentimento das Menções</h3>
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
