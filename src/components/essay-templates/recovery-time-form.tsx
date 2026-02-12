'use client';

import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type SampleData = {
  tiempoRecuperacion: number | string;
};

export type RecoveryTimeFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  samples: SampleData[];
  observacionesDesviaciones: string;
};

const initialSampleValues: SampleData = {
  tiempoRecuperacion: '',
};

function calculateAverage(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return sum / validValues.length;
}

function calculateStdDev(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v) && v > 0);
  const n = validValues.length;
  if (n < 2) return 0;
  const mean = calculateAverage(validValues);
  const sumOfSquaredDiffs = validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumOfSquaredDiffs / (n - 1));
}

const RecoveryTimeRow = ({ control, index }: { 
  control: Control<RecoveryTimeFormValues>, 
  index: number 
}) => {
  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.tiempoRecuperacion`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
    </TableRow>
  );
};

const RecoveryTimeResults = ({ control }: { control: Control<RecoveryTimeFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const { average, stdDev } = useMemo(() => {
    if (!samples) return { average: 0, stdDev: 0 };
    
    const recoveryTimes = samples.map(s => s.tiempoRecuperacion).filter(t => Number(t) > 0);
    
    return {
      average: calculateAverage(recoveryTimes),
      stdDev: calculateStdDev(recoveryTimes),
    };
  }, [samples]);

  return (
    <div className="mt-8 overflow-x-auto rounded-lg border max-w-sm mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-1/2">Muestra</TableHead>
            <TableHead className="text-center w-1/2">TR (s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samples.map((sample, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">{sample.tiempoRecuperacion || ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-left font-bold">Promedio</TableCell>
            <TableCell className="text-center font-bold">
              {average > 0 ? average.toFixed(2) : ''}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-bold">Desv. Est.</TableCell>
            <TableCell className="text-center font-bold">
              {stdDev > 0 ? stdDev.toFixed(2) : ''}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};


export function RecoveryTimeForm() {
  const form = useForm<RecoveryTimeFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 3386-1:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      samples: Array(3).fill(null).map(() => ({ ...initialSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: RecoveryTimeFormValues) => {
    console.log("Datos del formulario de Tiempo de Recuperación:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-4 border rounded-lg">
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
                  <FormLabel>Hora de inicio de ensayo</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura °C</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="Ej: 23" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humedadRelativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Humedad Relativa %H</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" min="0" placeholder="Ej: 50" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metodo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: INEN-ISO 3386-1:2014" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acondicionamiento"
              render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3">
                  <FormLabel>Acondicionamiento de muestra</FormLabel>
                  <FormControl>
                    <Input placeholder="16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>
        <div className="overflow-x-auto rounded-lg border max-w-md mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Muestra</TableHead>
                <TableHead className="text-center">Tiempo de recuperación (s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <RecoveryTimeRow key={field.id} control={form.control} index={index} />
              ))}
            </TableBody>
          </Table>
        </div>
        
        <RecoveryTimeResults control={form.control} />

        <FormField
          control={form.control}
          name="observacionesDesviaciones"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Observaciones/Desviaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Anota cualquier observación o desviación del método estándar..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" className="mt-4">Guardar Datos de Ensayo</Button>
        </div>
      </form>
    </Form>
  );
}
