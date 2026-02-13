'use client';

import { useForm, useFieldArray, useWatch, Control, UseFormReturn } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type SpecimenData = {
  thickness: {
    t1: number | string;
    t2: number | string;
    t3: number | string;
    t4: number | string;
    t5: number | string;
  };
  tearResistance: number | string;
};

export type TearFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  specimens: SpecimenData[];
  observacionesDesviaciones: string;
};

const initialSpecimenValues: SpecimenData = {
  thickness: { t1: '', t2: '', t3: '', t4: '', t5: '' },
  tearResistance: '',
};

function calculateMedian(values: (number | string)[]) {
  const sortedValues = values.map(Number).filter(v => !isNaN(v) && v > 0).sort((a, b) => a - b);
  if (sortedValues.length === 0) return 0;
  
  const mid = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
}

function calculateAverage(values: number[]) {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

function calculateStdDev(values: number[]) {
  const n = values.length;
  if (n < 2) return 0;
  const mean = calculateAverage(values);
  const sumOfSquaredDiffs = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumOfSquaredDiffs / (n - 1));
}


const TearRow = ({ control, index, setFocus, totalSamples }: { 
  control: Control<TearFormValues>, 
  index: number,
  setFocus: UseFormReturn<TearFormValues>['setFocus'],
  totalSamples: number
}) => {
  const specimen = useWatch({ control, name: `specimens.${index}` });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const { name } = e.currentTarget;
      const nameParts = name.split('.');
      const currentSampleIndex = parseInt(nameParts[1], 10);
      const dimension = nameParts[2] as 'thickness' | 'tearResistance';
      
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (dimension === 'thickness') {
              const measurement = nameParts[3]; // 't1', 't2' etc.
              const measurementNumber = parseInt(measurement.substring(1));
              if (measurementNumber < 5) {
                  setFocus(`specimens.${currentSampleIndex}.thickness.t${measurementNumber + 1}`);
              } else {
                  setFocus(`specimens.${currentSampleIndex}.tearResistance`);
              }
          } else { // tearResistance
              if (currentSampleIndex < totalSamples - 1) {
                  setFocus(`specimens.${currentSampleIndex + 1}.thickness.t1`);
              }
          }
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (dimension === 'thickness') {
              const measurement = nameParts[3]; // 't1', 't2' etc.
              const measurementNumber = parseInt(measurement.substring(1));
              if (measurementNumber > 1) {
                  setFocus(`specimens.${currentSampleIndex}.thickness.t${measurementNumber - 1}`);
              } else { // t1
                  if (currentSampleIndex > 0) {
                      setFocus(`specimens.${currentSampleIndex - 1}.tearResistance`);
                  }
              }
          } else { // tearResistance
              setFocus(`specimens.${currentSampleIndex}.thickness.t5`);
          }
      }
  };

  const median = useMemo(() => {
    if (!specimen) return 0;
    const calculatedMedian = calculateMedian(Object.values(specimen.thickness));
    return Math.round(calculatedMedian / 0.2) * 0.2;
  }, [specimen]);

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <div className="flex flex-col gap-1">
          <FormField
            control={control}
            name={`specimens.${index}.thickness.t1`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" onKeyDown={handleKeyDown} />}
          />
          <FormField
            control={control}
            name={`specimens.${index}.thickness.t2`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" onKeyDown={handleKeyDown} />}
          />
          <FormField
            control={control}
            name={`specimens.${index}.thickness.t3`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" onKeyDown={handleKeyDown} />}
          />
           <FormField
            control={control}
            name={`specimens.${index}.thickness.t4`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" onKeyDown={handleKeyDown} />}
          />
           <FormField
            control={control}
            name={`specimens.${index}.thickness.t5`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" onKeyDown={handleKeyDown} />}
          />
        </div>
      </TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {median > 0 ? median.toFixed(2) : ''}
      </TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
            control={control}
            name={`specimens.${index}.tearResistance`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
        />
      </TableCell>
    </TableRow>
  );
};

const TearFooter = ({ control }: { control: Control<TearFormValues> }) => {
  const specimens = useWatch({ control, name: 'specimens' });

  const { averageMedian, stdDevMedian, averageTearResistance, stdDevTearResistance } = useMemo(() => {
    if (!specimens) return { averageMedian: 0, stdDevMedian: 0, averageTearResistance: 0, stdDevTearResistance: 0 };
    
    const medians = specimens.map(s => {
        const median = calculateMedian(Object.values(s.thickness));
        return Math.round(median / 0.2) * 0.2;
    }).filter(m => m > 0);
    const tearResistances = specimens.map(s => Number(s.tearResistance)).filter(r => r > 0);
    
    return {
      averageMedian: calculateAverage(medians),
      stdDevMedian: calculateStdDev(medians),
      averageTearResistance: calculateAverage(tearResistances),
      stdDevTearResistance: calculateStdDev(tearResistances),
    };
  }, [specimens]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={2}>Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {averageMedian > 0 ? averageMedian.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
            {averageTearResistance > 0 ? averageTearResistance.toFixed(2) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={2}>Desviación</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {stdDevMedian > 0 ? stdDevMedian.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {stdDevTearResistance > 0 ? stdDevTearResistance.toFixed(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};


export function TearForm() {
  const form = useForm<TearFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN ISO 8067:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      specimens: Array(5).fill(null).map(() => ({ ...initialSpecimenValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'specimens',
  });

  const onSubmit = (data: TearFormValues) => {
    console.log("Datos del formulario de Desgarro:", data);
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
                    <Input placeholder="Ej: INEN-ISO 34-1:2016" {...field} />
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
        <div className="overflow-x-auto rounded-lg border max-w-2xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Espesor (mm)</TableHead>
                <TableHead className="text-center">Mediana (mm)</TableHead>
                <TableHead className="text-center">Resistencia al desgarro (N/mm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TearRow key={field.id} control={form.control} index={index} setFocus={form.setFocus} totalSamples={fields.length} />
              ))}
            </TableBody>
            <TearFooter control={form.control} />
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

    