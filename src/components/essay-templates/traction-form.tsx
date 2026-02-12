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

type ThreeMeasurements = {
  m1: number | string;
  m2: number | string;
  m3: number | string;
};

type SpecimenData = {
  ancho: ThreeMeasurements;
  espesor: ThreeMeasurements;
  resistenciaTraccion: number | string;
  elongacion: number | string;
};

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

const initialSpecimenValues: SpecimenData = {
  ancho: { m1: '', m2: '', m3: '' },
  espesor: { m1: '', m2: '', m3: '' },
  resistenciaTraccion: '',
  elongacion: '',
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

const TractionRow = ({ control, index }: { control: Control<TractionFormValues>, index: number }) => {
  const specimen = useWatch({ control, name: `specimens.${index}` });

  const medianAncho = useMemo(() => {
    if (!specimen) return 0;
    return calculateMedian(Object.values(specimen.ancho));
  }, [specimen.ancho]);
  
  const medianEspesor = useMemo(() => {
    if (!specimen) return 0;
    return calculateMedian(Object.values(specimen.espesor));
  }, [specimen.espesor]);
  
  const renderMeasurementInputs = (dimension: 'ancho' | 'espesor') => (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 3 }, (_, i) => `m${i + 1}`).map((fieldName) => (
        <FormField
          key={fieldName}
          control={control}
          name={`specimens.${index}.${dimension}.${fieldName as keyof ThreeMeasurements}`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} className="h-8" />}
        />
      ))}
    </div>
  );

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle min-w-[100px]">{renderMeasurementInputs('ancho')}</TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {medianAncho > 0 ? medianAncho.toFixed(2) : ''}
      </TableCell>
       <TableCell className="p-2 align-middle min-w-[100px]">{renderMeasurementInputs('espesor')}</TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {medianEspesor > 0 ? medianEspesor.toFixed(2) : ''}
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[150px]">
        <FormField
            control={control}
            name={`specimens.${index}.resistenciaTraccion`}
            render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
        />
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[150px]">
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
        avgMedianAncho,
        stdDevMedianAncho,
        avgMedianEspesor,
        stdDevMedianEspesor,
        avgResistencia,
        stdDevResistencia,
        avgElongacion,
        stdDevElongacion
    } = useMemo(() => {
        if (!specimens) return { avgMedianAncho: 0, stdDevMedianAncho: 0, avgMedianEspesor: 0, stdDevMedianEspesor: 0, avgResistencia: 0, stdDevResistencia: 0, avgElongacion: 0, stdDevElongacion: 0 };
        
        const medianasAncho = specimens.map(s => calculateMedian(Object.values(s.ancho))).filter(m => m > 0);
        const medianasEspesor = specimens.map(s => calculateMedian(Object.values(s.espesor))).filter(m => m > 0);
        const resistencias = specimens.map(s => Number(s.resistenciaTraccion)).filter(r => r > 0);
        const elongaciones = specimens.map(s => Number(s.elongacion)).filter(e => e > 0);

        return {
            avgMedianAncho: calculateAverage(medianasAncho),
            stdDevMedianAncho: calculateStdDev(medianasAncho),
            avgMedianEspesor: calculateAverage(medianasEspesor),
            stdDevMedianEspesor: calculateStdDev(medianasEspesor),
            avgResistencia: calculateAverage(resistencias),
            stdDevResistencia: calculateStdDev(resistencias),
            avgElongacion: calculateAverage(elongaciones),
            stdDevElongacion: calculateStdDev(elongaciones),
        };
    }, [specimens]);

    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2} className="text-right font-bold p-2 align-middle">Promedio</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{avgMedianAncho > 0 ? avgMedianAncho.toFixed(2) : ''}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{avgMedianEspesor > 0 ? avgMedianEspesor.toFixed(2) : ''}</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{avgResistencia > 0 ? avgResistencia.toFixed(2) : ''}</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{avgElongacion > 0 ? avgElongacion.toFixed(2) : ''}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} className="text-right font-bold p-2 align-middle">Desviación</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{stdDevMedianAncho > 0 ? stdDevMedianAncho.toFixed(2) : ''}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{stdDevMedianEspesor > 0 ? stdDevMedianEspesor.toFixed(2) : ''}</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{stdDevResistencia > 0 ? stdDevResistencia.toFixed(2) : ''}</TableCell>
                <TableCell className="text-center font-bold bg-secondary p-2 align-middle">{stdDevElongacion > 0 ? stdDevElongacion.toFixed(2) : ''}</TableCell>
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
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[80px]">Muestra</TableHead>
                <TableHead className="text-center">Ancho (mm)</TableHead>
                <TableHead className="text-center">Mediana Ancho (mm)</TableHead>
                <TableHead className="text-center">Espesor (mm)</TableHead>
                <TableHead className="text-center">Mediana Espesor (mm)</TableHead>
                <TableHead className="text-center">Resistencia a la tracción (kPa)</TableHead>
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
