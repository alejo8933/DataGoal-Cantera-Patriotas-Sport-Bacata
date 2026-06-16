"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface MatchData {
  name: string;
  favor: number;
  contra: number;
}

interface AnalyticsChartProps {
  data: MatchData[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Rendimiento Técnico</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Goles a favor vs contra (Últimos Partidos)</p>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #f3f4f6', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: '700'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: '700' }}
            />
            <Bar 
              name="Goles a Favor" 
              dataKey="favor" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              name="Goles en Contra" 
              dataKey="contra" 
              fill="#94a3b8" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
