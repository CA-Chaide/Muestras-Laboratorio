import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker } from 'lucide-react';

export default function SamplesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Registro de Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Muestras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
              <Beaker className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Módulo de Registro de Muestras</h3>
              <p className="text-muted-foreground">Este módulo está listo para ser construido.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
