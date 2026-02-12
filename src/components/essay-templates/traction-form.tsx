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

// Define the type for multiple measurements
type Measurements = {
  m1: number | string;
  m2: number | string;
  m3: number | string;
  m4: number | string;
  m5: number | string;
};

// Define the type for a single specimen's data
type SpecimenData = {
  ancho: Measurements;
  espesor: Measurements;
  traccion: number | string;
  elongacion: number | string;
};

// Define the full form's value structure
export type TractionFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  specimens: SpecimenData[];
  observacionesDesviaciones: string;
};

// Initial values for a new specimen
const initialSpecimenValues: SpecimenData = {
  ancho: { m1: '', m2: '', m3: '', m4: '', m5: '' },
  espesor: { m1: '', m2: '', m3: '', m4: '', m5: '' },
  traccion: '',
  elongacion: '',
};

// --- Calculation Helpers ---
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
// --- End Calculation Helpers ---

const TractionRow = ({ control, index }: { control: Control<TractionFormValues>, index: number }) => {
  const specimen = useWatch({ control, name: `specimens.${index}` });

  const medianAncho = useMemo(() => {
    if (!specimen) return 0;
    return calculateMedian(Object.values(specimen.ancho));
  }, [specimen.ancho]);

  const medianEspesor = useMemo(() => {
    if (!specimen) return 0;
    const calculatedMedian = calculateMedian(Object.values(specimen.espesor));
    return Math.round(calculatedMedian / 0.2) * 0.2; // Rounding logic
  }, [specimen.espesor]);

  const renderMeasurementInputs = (dimension: 'ancho' | 'espesor') => (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 5 }, (_, i) => `m${i + 1}`).map((fieldName) => (
        <FormField
          key={fieldName}
          control={control}
          name={`specimens.${index}.${dimension}.${fieldName as keyof Measurements}`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" />}
        />
      ))}
    </div>
  );

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">{renderMeasurementInputs('ancho')}</TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {medianAncho > 0 ? medianAncho.toFixed(2) : ''}
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">{renderMeasurementInputs('espesor')}</TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {medianEspesor > 0 ? medianEspesor.toFixed(2) : ''}
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">
        <FormField
          control={control}
          name={`specimens.${index}.traccion`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">
        <FormField
          control={control}
          name={`specimens.${index}.elongacion`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
    </TableRow>
  );
};

const TractionFooter = ({ control }: { control: Control<TractionFormValues> }) => {
    const specimens = useWatch({ control, name: 'specimens' });

    const {
        averageMedianAncho,
        stdDevMedianAncho,
        averageMedianEspesor,
        stdDevMedianEspesor,
        averageTraccion,
        stdDevTraccion,
        averageElongacion,
        stdDevElongacion
    } = useMemo(() => {
        if (!specimens) return { 
            averageMedianAncho: 0, stdDevMedianAncho: 0, averageMedianEspesor: 0, stdDevMedianEspesor: 0,
            averageTraccion: 0, stdDevTraccion: 0, averageElongacion: 0, stdDevElongacion: 0
        };
        
        const medianasAncho = specimens.map(s => calculateMedian(Object.values(s.ancho))).filter(m => m > 0);
        const medianasEspesor = specimens.map(s => {
            const median = calculateMedian(Object.values(s.espesor));
            return Math.round(median / 0.2) * 0.2;
        }).filter(m => m > 0);
        const tracciones = specimens.map(s => Number(s.traccion)).filter(r => r > 0);
        const elongaciones = specimens.map(s => Number(s.elongacion)).filter(r => r > 0);
        
        return {
            averageMedianAncho: calculateAverage(medianasAncho),
            stdDevMedianAncho: calculateStdDev(medianasAncho),
            averageMedianEspesor: calculateAverage(medianasEspesor),
            stdDevMedianEspesor: calculateStdDev(medianasEspesor),
            averageTraccion: calculateAverage(tracciones),
            stdDevTraccion: calculateStdDev(tracciones),
            averageElongacion: calculateAverage(elongaciones),
            stdDevElongacion: calculateStdDev(elongaciones),
        };
    }, [specimens]);

    return (
        <TableFooter>
            <TableRow>
                <TableCell className="text-right font-bold text-destructive p-2 align-middle">Promedio</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {averageMedianAncho > 0 ? averageMedianAncho.toFixed(2) : ''}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {averageMedianEspesor > 0 ? averageMedianEspesor.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {averageTraccion > 0 ? averageTraccion.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {averageElongacion > 0 ? averageElongacion.toFixed(2) : ''}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="text-right font-bold text-destructive p-2 align-middle">Desviación</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {stdDevMedianAncho > 0 ? stdDevMedianAncho.toFixed(2) : ''}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {stdDevMedianEspesor > 0 ? stdDevMedianEspesor.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {stdDevTraccion > 0 ? stdDevTraccion.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle text-destructive">
                    {stdDevElongacion > 0 ? stdDevElongacion.toFixed(2) : ''}
                </TableCell>
            </TableRow>
        </TableFooter>
    )
}

export function TractionForm() {
  const form = useForm<TractionFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 1798:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      specimens: Array(5).fill(null).map(() => ({ ...initialSpecimenValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'specimens',
  });

  const onSubmit = (data: TractionFormValues) => {
    console.log("Datos del formulario de Tracción:", data);
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
                    <Input placeholder="Ej: INEN-ISO 1798:2014" {...field} />
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
        <div className="overflow-x-auto rounded-lg border max-w-6xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Ancho (mm)</TableHead>
                <TableHead className="text-center">Mediana Ancho (mm)</TableHead>
                <TableHead className="text-center">Espesor (mm)</TableHead>
                <TableHead className="text-center">Mediana Espesor (mm)</TableHead>
                <TableHead className="text-center">Tracción (kPa)</TableHead>
                <TableHead className="text-center">Elongación (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TractionRow key={field.id} control={form.control} index={index} />
              ))}
            </TableBody>
            <TractionFooter control={form.control} />
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
