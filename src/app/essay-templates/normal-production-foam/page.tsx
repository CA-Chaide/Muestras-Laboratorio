'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DensityForm } from '@/components/essay-templates/density-form';
import { HardnessForm, type HardnessFormValues } from '@/components/essay-templates/hardness-form';
import { TearForm } from '@/components/essay-templates/tear-form';
import { PermeabilityForm } from '@/components/essay-templates/permeability-form';
import { TractionForm } from '@/components/essay-templates/traction-form';
import { FatigueForm } from '@/components/essay-templates/fatigue-form';
import { RecoveryTimeForm } from '@/components/essay-templates/recovery-time-form';
import { ResilienceForm } from '@/components/essay-templates/resilience-form';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { PermanentDeformationForm } from '@/components/essay-templates/permanent-deformation-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

const tests = [
  'Densidad',
  'Dureza',
  'Tracción',
  'Desgarro',
  'Deformación Remanente',
  'Permeabilidad',
  'Fatiga',
  'Tiempo de Recuperación',
  'Resiliencia',
];

const initialHardnessSampleValues = { espesor: '', dureza: '' };

export default function NormalProductionFoamPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const toValue = (str: string) => str.toLowerCase().replace(/ /g, '-');

  const hardnessForm = useForm<HardnessFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 2439:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      samples: Array(5).fill(null).map(() => ({ ...initialHardnessSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const hardnessSamples = hardnessForm.watch('samples');

  const handleSaveCompleteTemplate = () => {
    toast({
      title: "Guardando Plantilla",
      description: "Se están procesando todos los ensayos de la muestra.",
    });
    // Aquí iría la lógica para persistir todos los formularios en Firestore
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Plantilla: Ensayos Espumas Producción Normal" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Ensayos de Espuma - Producción Normal</CardTitle>
            <CardDescription>
              {testId ? `Ejecutando Prueba ID: ${testId}` : 'Completa los datos técnicos de cada ensayo solicitado.'}
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
              <TabsContent value="densidad">
                <Card>
                  <CardHeader>
                    <CardTitle>Densidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <DensityForm />
                  </CardContent>
                </Card>
              </TabsContent>
              {tests.slice(1).map((test) => (
                <TabsContent key={test} value={toValue(test)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{test}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       {toValue(test) === 'dureza' ? (
                          <HardnessForm form={hardnessForm} />
                        ) : toValue(test) === 'tracción' ? (
                          <TractionForm />
                        ) : toValue(test) === 'desgarro' ? (
                          <TearForm />
                        ) : toValue(test) === 'deformación-remanente' ? (
                          <PermanentDeformationForm />
                        ) : toValue(test) === 'permeabilidad' ? (
                          <PermeabilityForm />
                        ) : toValue(test) === 'fatiga' ? (
                          <FatigueForm initialHardnessValues={hardnessSamples?.slice(0,3)} />
                        ) : toValue(test) === 'tiempo-de-recuperación' ? (
                          <RecoveryTimeForm />
                        ) : toValue(test) === 'resiliencia' ? (
                          <ResilienceForm />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold">Formulario de {test}</h3>
                            <p className="text-muted-foreground">Este módulo está listo para ser construido.</p>
                          </div>
                        )}
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