import React from 'react';
import {
  AreaChart as ReChartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: any[];
  height?: number;
  gradientColor?: string;
  yAxisKey?: string;
  xAxisKey?: string;
  hideAxis?: boolean;
  xAxisOptions?: { interval?: number; angle?: number; textAnchor?: string }; // Adicionada propriedade xAxisOptions
}

const AreaChart = ({
  data,
  height = 200,
  gradientColor = '#CAF10A',
  yAxisKey = 'value',
  xAxisKey = 'name',
  hideAxis = false,
  xAxisOptions,
}: AreaChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#141414',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>{`Dia: ${label}`}</p>
          <p style={{ color: '#fff', margin: 0 }}>{`Quantidade: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsAreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: hideAxis ? 0 : 5,
          bottom: hideAxis ? 0 : 5,
        }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {!hideAxis && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        )}

        {!hideAxis && (
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            interval={xAxisOptions?.interval !== undefined ? xAxisOptions.interval : 'preserveStartEnd'} // Usar interval de xAxisOptions ou padrão
            angle={xAxisOptions?.angle || 0} // Rotação dos rótulos, padrão 0
            textAnchor={xAxisOptions?.textAnchor || 'middle'} // Ancoragem dos rótulos, padrão 'middle'
          />
        )}

        {!hideAxis && (
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
        )}

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />

        <Area
          type="monotone"
          dataKey={yAxisKey}
          stroke={gradientColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
      </ReChartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;