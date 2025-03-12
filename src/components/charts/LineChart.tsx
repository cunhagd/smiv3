
import React from 'react';
import {
  LineChart as ReChartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: any[];
  height?: number;
  lineColor?: string;
  yAxisKey?: string;
  xAxisKey?: string;
  hideAxis?: boolean;
  showGrid?: boolean;
  areaFill?: boolean;
}

const LineChart = ({
  data,
  height = 300,
  lineColor = "#CAF10A",
  yAxisKey = "value",
  xAxisKey = "name",
  hideAxis = false,
  showGrid = true,
  areaFill = false,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: hideAxis ? 0 : 20,
          bottom: hideAxis ? 0 : 20,
        }}
      >
        <defs>
          {areaFill && (
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
        
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
        
        <Line 
          type="monotone" 
          dataKey={yAxisKey} 
          stroke={lineColor} 
          strokeWidth={2} 
          dot={{ 
            fill: lineColor, 
            stroke: '#141414', 
            strokeWidth: 2,
            r: 4
          }}
          activeDot={{ 
            fill: '#fff',
            stroke: lineColor,
            strokeWidth: 2,
            r: 6
          }}
          {...(areaFill && { fill: "url(#colorLine)" })}
        />
      </ReChartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
