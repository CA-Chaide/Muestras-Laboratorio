'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tests = [
  'Densidad',
  'Dureza',
  'Tracción',
  'Desgarro',
  'Deformación Remanente',
  'Permeabilidad',
  'Fatiga',
  'Tiempo de Recuperación',
];

export default function NormalProductionFoamPage() {
  const toValue = (str: string) => str.toLowerCase().replace(/ /g, '-');

  return (
    <div className="flex flex-col w-full">
      <Header title="Plantilla: Ensayos Espumas Producción Normal" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Ensayos de Espuma - Producción Normal</CardTitle>
            <CardDescription>
              Selecciona un ensayo para ver o editar su configuración.
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
                          <h3 className="text-xl font-semibold">Formulario de {test}</h3>
                          <p className="text-muted-foreground">Este formulario está listo para ser construido.</p>
                        </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
