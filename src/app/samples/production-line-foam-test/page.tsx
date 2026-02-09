'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SampleForm, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";

export default function ProductionLineFoamTestPage() {
  const { toast } = useToast();

  const handleSubmit = (values: SampleFormValues) => {
    // TODO: Save data to Firestore
    console.log(values);
    toast({
      title: "Ensayo registrado",
      description: "El ensayo de espuma en línea de producción ha sido registrado exitosamente.",
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Registro de Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Ensayo de Espuma en Línea de Producción</CardTitle>
            <CardDescription>
              Complete el formulario para registrar un nuevo ensayo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SampleForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
