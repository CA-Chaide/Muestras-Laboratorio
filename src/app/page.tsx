import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SampleStatusChart } from '@/components/dashboard/sample-status-chart';
import { RecentTestsTable } from '@/components/dashboard/recent-tests-table';
import { FileText, FlaskConical, Beaker, CheckCircle, Clock } from 'lucide-react';
import { tests } from '@/lib/data';

export default function DashboardPage() {
  const completedTests = tests.filter(t => t.status === 'Completado').length;
  const pendingTests = tests.filter(t => t.status !== 'Completado').length;
  
  return (
    <div className="flex flex-col w-full">
      <Header title="Panel de Control" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Muestras Totales"
            value="1,254"
            icon={Beaker}
            description="+20.1% desde el mes pasado"
          />
          <StatsCard
            title="Pruebas Completadas"
            value={completedTests.toString()}
            icon={CheckCircle}
            description="Todos los análisis completados"
          />
          <StatsCard
            title="Pruebas Pendientes"
            value={pendingTests.toString()}
            icon={Clock}
            description="Pruebas actualmente en curso"
          />
          <StatsCard
            title="Informes Generados"
            value="312"
            icon={FileText}
            description="Total de informes emitidos"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Resumen del Estado de las Muestras</CardTitle>
              <CardDescription>
                Una representación visual de los estados de las muestras en el laboratorio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SampleStatusChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Pruebas Recientes</CardTitle>
              <CardDescription>
                Un resumen de las pruebas asignadas más recientemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTestsTable tests={tests.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
