'use client';

import { useFieldArray, useWatch, Control, UseFormReturn } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type SampleData = {
  espesor: number | string;
  dureza: number | string;
};

export type HardnessFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  samples: SampleData[];
  observacionesDesviaciones: string;
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

function roundHardness(value: number): number {
    if (value <= 0) return 0;
    if (value <= 100) {
        return Math.round(value);
    }
    return Math.round(value / 5) * 5;
}

const HardnessRow = ({ control, index }: { 
  control: Control<HardnessFormValues>, 
  index: number 
}) => {
  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.espesor`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.dureza`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
    </TableRow>
  );
};

const HardnessFooter = ({ control }: { control: Control<HardnessFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const {
    promedioEspesor,
    desviacionEspesor,
    promedioDureza,
    desviacionDureza
  } = useMemo(() => {
    if (!samples) return { promedioEspesor: 0, desviacionEspesor: 0, promedioDureza: 0, desviacionDureza: 0 };
    
    const espesores = samples.map(s => s.espesor);
    const durezas = samples.map(s => s.dureza);
    
    const avgDureza = calculateAverage(durezas);

    return {
      promedioEspesor: calculateAverage(espesores),
      desviacionEspesor: calculateStdDev(espesores),
      promedioDureza: roundHardness(avgDureza),
      desviacionDureza: calculateStdDev(durezas),
    };
  }, [samples]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle">Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioEspesor > 0 ? promedioEspesor.toFixed(1) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioDureza > 0 ? promedioDureza : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle">Desv. Est.</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionEspesor > 0 ? desviacionEspesor.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionDureza > 0 ? desviacionDureza.toFixed(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

interface HardnessFormProps {
    form: UseFormReturn<HardnessFormValues>;
}

export function HardnessForm({ form }: HardnessFormProps) {
  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: HardnessFormValues) => {
    console.log("Datos del formulario de Dureza:", data);
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
                    <Input placeholder="Ej: INEN-ISO 2439:2014" {...field} />
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
        <div className="overflow-x-auto rounded-lg border max-w-lg mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Espesor (mm)</TableHead>
                <TableHead className="text-center">Dureza -40% (N)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <HardnessRow key={field.id} control={form.control} index={index} />
              ))}
            </TableBody>
            <HardnessFooter control={form.control} />
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
