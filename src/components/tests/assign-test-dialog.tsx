'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockCurrentUser, getUsers, getAllSamples } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { assignTest } from '@/lib/tests';
import type { UserProfile, Sample } from '@/lib/types';

const assignTestSchema = z.object({
  technicianId: z.string().min(1, 'Debe seleccionar un técnico.'),
  sampleId: z.string().min(1, 'Debe seleccionar una muestra.'),
  templateId: z.string().min(1, 'Debe seleccionar una plantilla.'),
});

type AssignTestFormValues = z.infer<typeof assignTestSchema>;

interface AssignTestDialogProps {
  children: React.ReactNode;
}

const templates = [
  { id: 'normal-production-foam', name: 'Ensayos Espumas Producción Normal' },
  { id: 'woven-fabric', name: 'Ensayos Telas Tejido Plano' }
];

export function AssignTestDialog({ children }: AssignTestDialogProps) {
  // TODO: Reemplazar mockCurrentUser con autenticación real
  const user = mockCurrentUser;
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssignTestFormValues>({
    resolver: zodResolver(assignTestSchema),
  });

  // TODO: Reemplazar con fetch a GET /api/users?role=Técnico
  const technicians = getUsers().filter(u => u.role === 'Técnico');
  // TODO: Reemplazar con fetch a GET /api/samples
  const samples = getAllSamples();

  const handleSubmit = async (values: AssignTestFormValues) => {
    setIsSubmitting(true);

    try {
      const technician = technicians?.find(t => t.id === values.technicianId);
      const sample = samples?.find(s => s.id === values.sampleId);
      const template = templates.find(t => t.id === values.templateId);

      if (!technician || !sample || !template) {
        throw new Error("Datos de asignación inválidos.");
      }

      // TODO: Reemplazar con llamada a POST /api/tests
      await assignTest(user.uid, {
        assignedTo: { id: technician.id, name: technician.name },
        sample: { id: sample.id, identificacion: sample.identificacion },
        template: { id: template.id, name: template.name },
      });

      toast({ title: 'Prueba Asignada', description: `Se ha asignado la prueba a ${technician.name}.` });
      setIsOpen(false);
      form.reset();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error al asignar la prueba',
          description: e.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Nueva Prueba</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="technicianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignar a Técnico</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un técnico" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians?.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sampleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Muestra a Analizar</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una muestra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {samples?.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.identificacion} ({s.categoria})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plantilla de Ensayo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una plantilla" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Asignando...' : 'Asignar Prueba'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
