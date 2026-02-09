'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SampleForm, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/firebase';
import { saveSample } from '@/lib/samples';

export default function FabricSamplePage() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: SampleFormValues) => {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe iniciar sesión para registrar una muestra.",
      });
      return;
    }
    setIsSubmitting(true);

    saveSample(firestore, user.uid, values);
    
    toast({
      title: "Muestra registrada",
      description: "La muestra de Tela ha sido registrada exitosamente.",
    });

    setIsSubmitting(false);
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
            <SampleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
