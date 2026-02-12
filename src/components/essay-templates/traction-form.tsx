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
  m1: number | string; m2: number | string; m3: number | string;
  m4: number | string; m5: number | string; m6: number | string;
  m7: number | string; m8: number | string; m9: number | string;
  m10: number | string; m11: number | string; m12: number | string;
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
  ancho: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '', m10: '', m11: '', m12: '' },
  espesor: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '', m10: '', m11: '', m12: '' },
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

  const intermediateMediansAncho = useMemo(() => {
    if (!specimen) return Array(4).fill(0);
    const values = Object.values(specimen.ancho);
    const medians: number[] = [];
    for (let i = 0; i < 12; i += 3) {
      const group = values.slice(i, i + 3);
      medians.push(calculateMedian(group));
    }
    return medians;
  }, [specimen.ancho]);

  const finalMedianAncho = useMemo(() => {
    return calculateMedian(intermediateMediansAncho);
  }, [intermediateMediansAncho]);


  const intermediateMediansEspesor = useMemo(() => {
    if (!specimen) return Array(4).fill(0);
    const values = Object.values(specimen.espesor);
    const medians: number[] = [];
    for (let i = 0; i < 12; i += 3) {
      const group = values.slice(i, i + 3);
      medians.push(calculateMedian(group));
    }
    return medians;
  }, [specimen.espesor]);

  const finalMedianEspesor = useMemo(() => {
    const finalMedian = calculateMedian(intermediateMediansEspesor);
    return Math.round(finalMedian / 0.2) * 0.2; // Rounding logic
  }, [intermediateMediansEspesor]);


  const renderMeasurementInputs = (dimension: 'ancho' | 'espesor') => (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 12 }, (_, i) => `m${i + 1}`).map((fieldName) => (
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
      <TableCell className="p-2 align-middle min-w-[120px]">
        <div className="flex flex-col gap-1 h-full justify-evenly">
          {intermediateMediansAncho.map((median, i) => (
            <Input key={i} readOnly value={median > 0 ? median.toFixed(2) : ''} className="h-8 bg-muted/50 text-center" />
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {finalMedianAncho > 0 ? finalMedianAncho.toFixed(2) : ''}
      </TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">{renderMeasurementInputs('espesor')}</TableCell>
      <TableCell className="p-2 align-middle min-w-[120px]">
        <div className="flex flex-col gap-1 h-full justify-evenly">
          {intermediateMediansEspesor.map((median, i) => (
            <Input key={i} readOnly value={median > 0 ? median.toFixed(2) : ''} className="h-8 bg-muted/50 text-center" />
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
        {finalMedianEspesor > 0 ? finalMedianEspesor.toFixed(2) : ''}
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
        averageTraccion,
        stdDevTraccion,
        averageElongacion,
        stdDevElongacion
    } = useMemo(() => {
        if (!specimens) return { 
            averageTraccion: 0, stdDevTraccion: 0, averageElongacion: 0, stdDevElongacion: 0
        };
        
        const tracciones = specimens.map(s => Number(s.traccion)).filter(r => r > 0);
        const elongaciones = specimens.map(s => Number(s.elongacion)).filter(r => r > 0);
        
        return {
            averageTraccion: calculateAverage(tracciones),
            stdDevTraccion: calculateStdDev(tracciones),
            averageElongacion: calculateAverage(elongaciones),
            stdDevElongacion: calculateStdDev(elongaciones),
        };
    }, [specimens]);

    return (
        <TableFooter>
            <TableRow>
                <TableCell className="text-right font-bold p-2 align-middle" colSpan={7}>Promedio</TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
                    {averageTraccion > 0 ? averageTraccion.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
                    {averageElongacion > 0 ? averageElongacion.toFixed(2) : ''}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="text-right font-bold p-2 align-middle" colSpan={7}>Desviación</TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
                    {stdDevTraccion > 0 ? stdDevTraccion.toFixed(2) : ''}
                </TableCell>
                 <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
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
        <div className="overflow-x-auto rounded-lg border max-w-7xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[80px]">Muestra</TableHead>
                <TableHead className="text-center">Ancho (mm)</TableHead>
                <TableHead className="text-center">Medianas Ancho (mm)</TableHead>
                <TableHead className="text-center">Mediana Final Ancho (mm)</TableHead>
                <TableHead className="text-center">Espesor (mm)</TableHead>
                <TableHead className="text-center">Medianas Espesor (mm)</TableHead>
                <TableHead className="text-center">Mediana Final Espesor (mm)</TableHead>
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
