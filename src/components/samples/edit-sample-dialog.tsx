'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilePenLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SampleForm, sampleFormSchema, type SampleFormValues } from '@/components/samples/sample-form';
import { useToast } from "@/hooks/use-toast";
import { mockCurrentUser } from '@/lib/data';
import { updateSample } from '@/lib/samples';
import type { Sample } from '@/lib/types';
import { format } from 'date-fns';

interface EditSampleDialogProps {
  sample: Sample & { id: string };
  onSuccess?: () => void;
}

export function EditSampleDialog({ sample, onSuccess }: EditSampleDialogProps) {
  const { toast } = useToast();
  // TODO: Reemplazar mockCurrentUser con usuario autenticado desde la API
  const user = mockCurrentUser;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const registrationDate = new Date(sample.registrationDateTime);

  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      identificacion: sample.identificacion,
      fechaIngreso: registrationDate,
      horaIngreso: format(registrationDate, 'HH:mm'),
      descripcion: sample.descripcion,
      fechaFabricacionLote: sample.fechaFabricacionLote,
      ensayosSolicitados: sample.ensayosSolicitados,
      solicitudNumero: sample.solicitudNumero,
      informeNumero: sample.informeNumero,
      tipoMuestra: sample.tipoMuestra,
    },
  });

  const handleSubmit = async (values: SampleFormValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Reemplazar con llamada a PUT /api/samples/:id
      await updateSample(user.uid, sample.id, values);
      toast({
        title: "Muestra actualizada",
        description: "La muestra ha sido actualizada exitosamente.",
      });
      setIsOpen(false);
      onSuccess?.();
    } catch(e) {
      if (e instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar la muestra",
          description: e.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FilePenLine className="h-4 w-4" />
          <span className="sr-only">Editar Muestra</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Editar Muestra: {sample.identificacion}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <SampleForm form={form} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Actualizar Muestra" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
