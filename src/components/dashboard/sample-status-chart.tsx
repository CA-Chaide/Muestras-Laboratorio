'use client';
import { BarChart } from 'recharts';
import {
  ChartContainer,
} from '@/components/ui/chart';

export function SampleStatusChart() {
  return (
    <ChartContainer config={{}} className="min-h-[200px] w-full h-80 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <BarChart width={0} height={0} data={[]} />
        <p>No hay datos de estado de muestras disponibles.</p>
      </div>
    </ChartContainer>
  );
}
