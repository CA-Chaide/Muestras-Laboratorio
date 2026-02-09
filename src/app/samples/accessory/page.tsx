'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SampleForm, sampleFormSchema, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/firebase';
import { saveSample } from '@/lib/samples';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AccessorySamplePage() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
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
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe iniciar sesión para registrar una muestra.",
      });
      return;
    }
    setIsSubmitting(true);
    
    try {
      await saveSample(firestore, user.uid, values, 'Complemento');
      toast({
        title: "Muestra registrada",
        description: "La muestra de Complemento ha sido registrada exitosamente.",
      });
      form.reset();
    } catch(e) {
        // The global error handler will display a toast for permission errors
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
            <CardTitle>Nueva Muestra de Complemento</CardTitle>
            <CardDescription>
              Complete el formulario para registrar una nueva muestra de complemento.
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
