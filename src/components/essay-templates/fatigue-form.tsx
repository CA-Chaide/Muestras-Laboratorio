'use client';

import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
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
  espesorInicial: number | string;
  durezaInicial: number | string;
  espesorFinal: number | string;
  durezaFinal: number | string;
};

export type FatigueFormValues = {
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
  espesorInicial: '',
  durezaInicial: '',
  espesorFinal: '',
  durezaFinal: '',
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

const FatigueRow = ({ control, index }: { 
  control: Control<FatigueFormValues>, 
  index: number 
}) => {
  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.espesorInicial`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.durezaInicial`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.espesorFinal`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.durezaFinal`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
    </TableRow>
  );
};

const FatigueFooter = ({ control }: { control: Control<FatigueFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const {
    promedioEspesorInicial,
    desviacionEspesorInicial,
    promedioDurezaInicial,
    desviacionDurezaInicial,
    promedioEspesorFinal,
    desviacionEspesorFinal,
    promedioDurezaFinal,
    desviacionDurezaFinal,
  } = useMemo(() => {
    if (!samples) return { 
        promedioEspesorInicial: 0, desviacionEspesorInicial: 0, promedioDurezaInicial: 0, desviacionDurezaInicial: 0,
        promedioEspesorFinal: 0, desviacionEspesorFinal: 0, promedioDurezaFinal: 0, desviacionDurezaFinal: 0 
    };
    
    const espesoresIniciales = samples.map(s => s.espesorInicial);
    const durezasIniciales = samples.map(s => s.durezaInicial);
    const espesoresFinales = samples.map(s => s.espesorFinal);
    const durezasFinales = samples.map(s => s.durezaFinal);
    
    return {
      promedioEspesorInicial: calculateAverage(espesoresIniciales),
      desviacionEspesorInicial: calculateStdDev(espesoresIniciales),
      promedioDurezaInicial: calculateAverage(durezasIniciales),
      desviacionDurezaInicial: calculateStdDev(durezasIniciales),
      promedioEspesorFinal: calculateAverage(espesoresFinales),
      desviacionEspesorFinal: calculateStdDev(espesoresFinales),
      promedioDurezaFinal: calculateAverage(durezasFinales),
      desviacionDurezaFinal: calculateStdDev(durezasFinales),
    };
  }, [samples]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle">Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioEspesorInicial > 0 ? promedioEspesorInicial.toFixed(1) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioDurezaInicial > 0 ? promedioDurezaInicial.toFixed(1) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioEspesorFinal > 0 ? promedioEspesorFinal.toFixed(1) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioDurezaFinal > 0 ? promedioDurezaFinal.toFixed(1) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle">Desv. Est.</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionEspesorInicial > 0 ? desviacionEspesorInicial.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionDurezaInicial > 0 ? desviacionDurezaInicial.toFixed(2) : ''}
        </TableCell>
         <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionEspesorFinal > 0 ? desviacionEspesorFinal.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionDurezaFinal > 0 ? desviacionDurezaFinal.toFixed(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export function FatigueForm() {
  const form = useForm<FatigueFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 3385:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      samples: Array(3).fill(null).map(() => ({ ...initialSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: FatigueFormValues) => {
    console.log("Datos del formulario de Fatiga:", data);
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
                    <Input placeholder="Ej: INEN-ISO 3385:2014" {...field} />
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
        <div className="overflow-x-auto rounded-lg border max-w-4xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Espesor inicial (mm)</TableHead>
                <TableHead className="text-center">Dureza -40% inicial (N)</TableHead>
                <TableHead className="text-center">Espesor final (mm)</TableHead>
                <TableHead className="text-center">Dureza -40% final (N)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <FatigueRow key={field.id} control={form.control} index={index} />
              ))}
            </TableBody>
            <FatigueFooter control={form.control} />
          </Table>
        </div>
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
