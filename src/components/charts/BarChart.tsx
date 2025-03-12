
import React from 'react';
import {
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: any[];
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
  yAxisKey?: string;
  xAxisKey?: string;
  hideAxis?: boolean;
  showGrid?: boolean;
}

const BarChart = ({
  data,
  height = 300,
  positiveColor = "rgba(202, 241, 10, 0.9)",
  negativeColor = "rgba(0, 116, 228, 0.7)",
  yAxisKey = "value",
  xAxisKey = "name",
  hideAxis = false,
  showGrid = true,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: hideAxis ? 0 : 20,
          bottom: hideAxis ? 0 : 20,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />}
        
        {!hideAxis && <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />}
        
        {!hideAxis && <YAxis 
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />}
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#141414', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
        />
        
        <Bar dataKey={yAxisKey} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry[yAxisKey] >= 0 ? positiveColor : negativeColor} 
            />
          ))}
        </Bar>
      </ReChartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
