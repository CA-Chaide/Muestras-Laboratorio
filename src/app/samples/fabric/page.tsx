'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SampleForm, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";

export default function FabricSamplePage() {
  const { toast } = useToast();

  const handleSubmit = (values: SampleFormValues) => {
    // TODO: Save data to Firestore
    console.log(values);
    toast({
      title: "Muestra registrada",
      description: "La muestra de Tela ha sido registrada exitosamente.",
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Registro de Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Muestra de Tela</CardTitle>
            <CardDescription>
              Complete el formulario para registrar una nueva muestra de tela.
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
