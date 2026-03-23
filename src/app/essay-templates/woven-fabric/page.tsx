'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

const tests = [
  'Gramaje',
  'Ancho Útil',
  'Tracción Grab Test',
  'Desgarro Pantalón',
  'Estabilidad Dimensional',
  'Deslizamiento de Costura',
];

export default function WovenFabricPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const toValue = (str: string) => str.toLowerCase().replace(/ /g, '-');

  const handleSaveCompleteTemplate = () => {
    toast({
      title: "Guardando Plantilla",
      description: "Se están procesando todos los ensayos de la tela de tejido plano.",
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Plantilla: Ensayos Telas Tejido Plano" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Telas Tejido Plano - Especificaciones Técnicas</CardTitle>
            <CardDescription>
              {testId ? `Ejecutando Prueba ID: ${testId}` : 'Completa los datos técnicos de cada ensayo solicitado para la tela.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={toValue(tests[0])}>
              <TabsList className="h-auto flex-wrap justify-start">
                {tests.map((test) => (
                  <TabsTrigger key={test} value={toValue(test)}>
                    {test}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {tests.map((test) => (
                <TabsContent key={test} value={toValue(test)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{test}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">Módulo de {test}</h3>
                        <p className="text-muted-foreground">Formulario técnico en desarrollo para esta especificación.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
            <div className="flex justify-end mt-6">
              <Button size="lg" onClick={handleSaveCompleteTemplate} className="w-full md:w-auto">
                Guardar Plantilla Completa
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
