import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Panel de Control" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido a LabTrack</CardTitle>
            <CardDescription>
              Este es tu panel de control. Empecemos a construir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <LayoutDashboard className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Panel de Control Vacío</h3>
                <p className="text-muted-foreground">Tu panel de control está listo para ser personalizado.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
