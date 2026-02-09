'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'Enero', received: 186, completed: 80 },
  { month: 'Febrero', received: 305, completed: 200 },
  { month: 'Marzo', received: 237, completed: 120 },
  { month: 'Abril', received: 273, completed: 190 },
  { month: 'Mayo', received: 209, completed: 130 },
  { month: 'Junio', received: 214, completed: 140 },
];

const chartConfig = {
  received: {
    label: 'Recibidas',
    color: 'hsl(var(--primary))',
  },
  completed: {
    label: 'Completadas',
    color: 'hsl(var(--accent))',
  },
};

export function SampleStatusChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="received" fill="var(--color-received)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
