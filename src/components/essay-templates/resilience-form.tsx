'use client';

import { useForm, useFieldArray, Control, useWatch, UseFormReturn } from 'react-hook-form';
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
import { useMemo, KeyboardEvent } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type SampleData = {
  rebote1: number | string;
  rebote2: number | string;
  rebote3: number | string;
};

export type ResilienceFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  correctionFactor: number | string;
  samples: SampleData[];
  observacionesDesviaciones: string;
};

const initialSampleValues: SampleData = {
  rebote1: '',
  rebote2: '',
  rebote3: '',
};

function calculateMedian(values: (number | string)[]) {
    const sortedValues = values.map(Number).filter(v => !isNaN(v) && v > 0).sort((a, b) => a - b);
    if (sortedValues.length === 0) return 0;

    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
}

function calculateAverage(values: number[]) {
  const validValues = values.filter((v) => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return sum / validValues.length;
}

function calculateStdDev(values: number[]) {
  const validValues = values.filter((v) => !isNaN(v) && v > 0);
  const n = validValues.length;
  if (n < 2) return 0;
  const mean = calculateAverage(validValues);
  const sumOfSquaredDiffs = validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumOfSquaredDiffs / (n - 1));
}

const ResilienceRow = ({ control, index, setFocus, totalSamples }: {
  control: Control<ResilienceFormValues>,
  index: number,
  setFocus: UseFormReturn<ResilienceFormValues>['setFocus'],
  totalSamples: number
}) => {
  const values = useWatch({
    control,
    name: `samples.${index}`,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    const nameParts = name.split('.');
    const currentSampleIndex = parseInt(nameParts[1], 10);
    const fieldName = nameParts[2] as 'rebote1' | 'rebote2' | 'rebote3';
    
    const order: ('rebote1' | 'rebote2' | 'rebote3')[] = ['rebote1', 'rebote2', 'rebote3'];
    const currentIndex = order.indexOf(fieldName);
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight') {
        if (currentIndex < order.length - 1) {
            setFocus(`samples.${currentSampleIndex}.${order[currentIndex + 1]}`);
        } else { // last field for the sample
            if (currentSampleIndex < totalSamples - 1) {
                setFocus(`samples.${currentSampleIndex + 1}.${order[0]}`);
            }
        }
    } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
            setFocus(`samples.${currentSampleIndex}.${order[currentIndex - 1]}`);
        }
    } else if (e.key === 'ArrowDown') {
        if (currentSampleIndex < totalSamples - 1) {
            setFocus(`samples.${currentSampleIndex + 1}.${fieldName}`);
        }
    } else if (e.key === 'ArrowUp') {
        if (currentSampleIndex > 0) {
            setFocus(`samples.${currentSampleIndex - 1}.${fieldName}`);
        }
    }
  };

  const resiliencia = useMemo(() => {
    const rebotes = [values.rebote1, values.rebote2, values.rebote3];
    const medianResilience = calculateMedian(rebotes);
    return Math.round(medianResilience);
  }, [values.rebote1, values.rebote2, values.rebote3]);

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.rebote1`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.rebote2`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.rebote3`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
        />
      </TableCell>
      <TableCell className="text-center bg-secondary p-2 align-middle">
        {resiliencia > 0 ? resiliencia : ''}
      </TableCell>
    </TableRow>
  );
};

const ResilienceFooter = ({ control }: { control: Control<ResilienceFormValues> }) => {
  const [samples, correctionFactor] = useWatch({
    control,
    name: ["samples", "correctionFactor"],
  });

  const { medianOfMedians, stdDev, correctedMedian } = useMemo(() => {
    if (!samples) return { medianOfMedians: 0, stdDev: 0, correctedMedian: 0 };

    const medianResiliences = samples.map(s => {
      const rebotes = [s.rebote1, s.rebote2, s.rebote3];
      const medianResilience = calculateMedian(rebotes);
      return Math.round(medianResilience);
    }).filter(r => r > 0);

    const initialMedian = calculateMedian(medianResiliences);
    const numCorrectionFactor = Number(correctionFactor) || 0;
    const finalCorrectedMedian = initialMedian + numCorrectionFactor;

    return {
      medianOfMedians: initialMedian,
      stdDev: calculateStdDev(medianResiliences),
      correctedMedian: finalCorrectedMedian,
    };
  }, [samples, correctionFactor]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold" colSpan={4}>Resiliencia</TableCell>
        <TableCell className="text-center font-bold bg-accent text-accent-foreground">
          {medianOfMedians > 0 ? Math.round(correctedMedian) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold" colSpan={4}>Desv. Est.</TableCell>
        <TableCell className="text-center font-bold bg-secondary">
          {stdDev > 0 ? stdDev.toFixed(1) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export function ResilienceForm() {
  const form = useForm<ResilienceFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN ISO 8307:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      correctionFactor: '',
      samples: Array(3).fill(null).map(() => ({ ...initialSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: ResilienceFormValues) => {
    console.log("Datos del formulario de Resiliencia:", data);
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
                    <Input placeholder="Ej: INEN ISO 8307:2014" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="correctionFactor"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Factor de Corrección Anual</FormLabel>
                    <FormControl>
                        <Input type="number" step="any" placeholder="Ej: 1.5 o -0.5" {...field} />
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
        <div className="overflow-x-auto rounded-lg border max-w-3xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Medición 1 (%)</TableHead>
                <TableHead className="text-center">Medición 2 (%)</TableHead>
                <TableHead className="text-center">Medición 3 (%)</TableHead>
                <TableHead className="text-center">Resiliencia (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <ResilienceRow key={field.id} control={form.control} index={index} setFocus={form.setFocus} totalSamples={fields.length} />
              ))}
            </TableBody>
            <ResilienceFooter control={form.control} />
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

    