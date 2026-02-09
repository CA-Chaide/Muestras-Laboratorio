'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const sampleFormSchema = z.object({
  identificacion: z.string().min(1, 'La identificación es requerida.'),
  fechaIngreso: z.date({
    required_error: 'La fecha de ingreso es requerida.',
  }),
  horaIngreso: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)."),
  descripcion: z.string().min(1, 'La descripción es requerida.'),
  fechaFabricacionLote: z.string().min(1, 'La fecha de fabricación/lote es requerida.'),
  tipoMuestra: z.enum(['Producción Normal', 'Prueba de Producción', 'Prueba de Calidad', 'Ensayo Rápido'], {
    required_error: "Debe seleccionar un tipo de muestra."
  }),
  ensayosSolicitados: z.string().min(1, 'Los ensayos solicitados son requeridos.'),
  solicitudNumero: z.string().min(1, 'El número de solicitud es requerido.'),
  informeNumero: z.string().min(1, 'El número de informe es requerido.'),
});

export type SampleFormValues = z.infer<typeof sampleFormSchema>;

interface SampleFormProps {
  form: UseFormReturn<SampleFormValues>;
  onSubmit: (values: SampleFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function SampleForm({ form, onSubmit, isSubmitting, submitButtonText = 'Registrar Muestra' }: SampleFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="identificacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: ESP-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaIngreso"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Fecha de ingreso</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horaIngreso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de ingreso</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaFabricacionLote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fabricación/Lote</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 2024-01-01 o Lote-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tipoMuestra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de muestra</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Producción Normal">Producción Normal</SelectItem>
                      <SelectItem value="Prueba de Producción">Prueba de Producción</SelectItem>
                      <SelectItem value="Prueba de Calidad">Prueba de Calidad</SelectItem>
                      <SelectItem value="Ensayo Rápido">Ensayo Rápido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solicitudNumero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Solicitud</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="informeNumero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Informe</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 67890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Descripción de la muestra</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Describe la muestra en detalle..."
                        className="resize-none h-32"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ensayosSolicitados"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ensayos solicitados</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Lista de ensayos a realizar..."
                        className="resize-none h-32"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
