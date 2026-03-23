'use client';

import { useForm, useWatch, Control, UseFormReturn } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useMemo, KeyboardEvent } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type TearSenseData = {
  f1: number | string;
  f2: number | string;
  f3: number | string;
  f4: number | string;
  f5: number | string;
};

export type WovenTearFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  metodo: string;
  acondicionamiento: string;
  urdiembre: TearSenseData;
  transversal: TearSenseData;
  observacionesDesviaciones: string;
};

const initialSenseValues: TearSenseData = {
  f1: '', f2: '', f3: '', f4: '', f5: '',
};

function calculateAverage(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return sum / validValues.length;
}

const TearSenseRow = ({ 
  control, 
  sense, 
  label, 
  setFocus 
}: { 
  control: Control<WovenTearFormValues>, 
  sense: 'urdiembre' | 'transversal', 
  label: string,
  setFocus: UseFormReturn<WovenTearFormValues>['setFocus']
}) => {
  const values = useWatch({
    control,
    name: sense,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    const nameParts = name.split('.'); 
    const fieldName = nameParts[1];
    
    const fieldsOrder = ['f1', 'f2', 'f3', 'f4', 'f5'];
    const currentIndex = fieldsOrder.indexOf(fieldName);

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < fieldsOrder.length - 1) {
        setFocus(`${sense}.${fieldsOrder[currentIndex + 1]}` as any);
      } else if (sense === 'urdiembre') {
        setFocus('transversal.f1');
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        setFocus(`${sense}.${fieldsOrder[currentIndex - 1]}` as any);
      } else if (sense === 'transversal') {
        setFocus('urdiembre.f5');
      }
    }
  };

  const promedioFuerza = useMemo(() => {
    const forces = [values.f1, values.f2, values.f3, values.f4, values.f5];
    return calculateAverage(forces);
  }, [values.f1, values.f2, values.f3, values.f4, values.f5]);

  return (
    <TableRow>
      <TableCell className="font-bold text-center bg-muted/30">{label}</TableCell>
      {[1, 2, 3, 4, 5].map((num) => (
        <TableCell key={num} className="p-2">
          <FormField
            control={control}
            name={`${sense}.f${num}` as any}
            render={({ field }) => (
              <Input 
                type="number" 
                step="any" 
                min="0" 
                {...field} 
                onKeyDown={handleKeyDown}
                className="text-center"
              />
            )}
          />
        </TableCell>
      ))}
      <TableCell className="text-center font-bold bg-secondary/20">
        {promedioFuerza > 0 ? promedioFuerza.toFixed(1) : '-'}
      </TableCell>
    </TableRow>
  );
};

export function WovenTearForm() {
  const form = useForm<WovenTearFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      metodo: 'ASTM D1424',
      acondicionamiento: '24 h, temperatura: 21°C ± 1°C, humedad relativa: 65% ± 2%',
      urdiembre: { ...initialSenseValues },
      transversal: { ...initialSenseValues },
      observacionesDesviaciones: '',
    },
  });

  const onSubmit = (data: WovenTearFormValues) => {
    console.log("Datos del formulario de Desgarro Telas:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 border rounded-lg bg-card">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha inicio de ensayo</FormLabel>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="horaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metodo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Ensayo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acondicionamiento"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Acondicionamiento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[150px]">Sentido</TableHead>
                <TableHead colSpan={5} className="text-center border-l border-r">Fuerza de Desgarro (N)</TableHead>
                <TableHead className="text-center">Promedio Fuerza (N)</TableHead>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableHead></TableHead>
                <TableHead className="text-center border-l">1</TableHead>
                <TableHead className="text-center">2</TableHead>
                <TableHead className="text-center">3</TableHead>
                <TableHead className="text-center">4</TableHead>
                <TableHead className="text-center border-r">5</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TearSenseRow control={form.control} sense="urdiembre" label="Urdiembre" setFocus={form.setFocus} />
              <TearSenseRow control={form.control} sense="transversal" label="Transversal" setFocus={form.setFocus} />
            </TableBody>
          </Table>
        </div>

        <FormField
          control={form.control}
          name="observacionesDesviaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones / Desviaciones</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Registre cualquier observación relevante..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}