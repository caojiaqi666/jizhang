"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryChartProps {
  data: { name: string; value: number }[]
}

// Colors palette
const COLORS = [
    "#fdba74", // orange-300
    "#93c5fd", // blue-300
    "#f9a8d4", // pink-300
    "#d8b4fe", // purple-300
    "#c7d2fe", // indigo-300
    "#86efac", // teal-300
    "#fca5a5", // red-300
    "#cbd5e1", // gray-300
]

export function CategoryChart({ data }: CategoryChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-xl">Loading...</div>;

  if (!data || data.length === 0) return <div className="w-full h-[200px] flex items-center justify-center text-gray-400 text-xs">暂无数据</div>;

  const total = data.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <div className="w-full h-[200px] flex items-center gap-4">
      <div className="flex-1 h-full relative" style={{ minHeight: '200px', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#374151', fontSize: '12px' }}
                formatter={(value: number) => [`¥${value}`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-xs text-gray-400">总支出</span>
           <span className="text-xl font-bold text-gray-800">{total > 10000 ? (total/10000).toFixed(1)+'w' : total.toFixed(0)}</span>
        </div>
      </div>
      
      {/* Legend - Limit to 5 */}
      <div className="w-[120px] space-y-2 pr-4">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-gray-600 truncate max-w-[60px]">{item.name}</span>
            </div>
            <span className="font-mono text-gray-900">{(item.value / total * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
