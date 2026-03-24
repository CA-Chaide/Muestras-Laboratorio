'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SampleForm, sampleFormSchema, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";
import { mockCurrentUser } from '@/lib/data';
import { saveSample } from '@/lib/samples';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function MattressSamplePage() {
  const { toast } = useToast();
  // TODO: Reemplazar mockCurrentUser con usuario autenticado desde la API
  const user = mockCurrentUser;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      identificacion: '',
      horaIngreso: '00:00',
      descripcion: '',
      fechaFabricacionLote: '',
      ensayosSolicitados: '',
      solicitudNumero: '',
      informeNumero: '',
      tipoMuestra: 'Producción Normal'
    },
  });

  const handleSubmit = async (values: SampleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Reemplazar con llamada a API
      await saveSample(user.uid, values, 'Colchón');
      toast({
        title: "Muestra registrada",
        description: "La muestra de Colchón ha sido registrada exitosamente.",
      });
      form.reset();
    } catch(e) {
      if (e instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error al registrar la muestra",
          description: e.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Registro de Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Muestra de Colchón</CardTitle>
            <CardDescription>
              Complete el formulario para registrar una nueva muestra de colchón.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SampleForm form={form} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
