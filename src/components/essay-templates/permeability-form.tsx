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
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type SampleData = {
  flujoMms: number | string; // Velocidad de Flujo (mm/s)
};

export type PermeabilityFormValues = {
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
  flujoMms: '',
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

// Calculate Volumetric Flow (dm³/s) = 0.0025 * Velocidad de Flujo (mm/s)
function calculateVolumetricFlow(velocidadFlujo: number | string): number {
    const numVelocidad = Number(velocidadFlujo);
    if (isNaN(numVelocidad) || numVelocidad <= 0) return 0;
    return 0.0025 * numVelocidad;
}

const PermeabilityRow = ({ control, index, setFocus, totalSamples }: { 
  control: Control<PermeabilityFormValues>, 
  index: number,
  setFocus: UseFormReturn<PermeabilityFormValues>['setFocus'],
  totalSamples: number
}) => {
  const values = useWatch({
      control,
      name: `samples.${index}`,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      const { name } = e.currentTarget;
      const currentSampleIndex = parseInt(name.split('.')[1], 10);

      if (e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentSampleIndex < totalSamples - 1) {
              setFocus(`samples.${currentSampleIndex + 1}.flujoMms`);
          }
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentSampleIndex > 0) {
              setFocus(`samples.${currentSampleIndex - 1}.flujoMms`);
          }
      }
  };

  const flujoVolumetrico = useMemo(() => calculateVolumetricFlow(values.flujoMms), [values.flujoMms]);

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle">
        <FormField
          control={control}
          name={`samples.${index}.flujoMms`}
          render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
        />
      </TableCell>
      <TableCell className="text-center bg-secondary p-2 align-middle">
        {flujoVolumetrico > 0 ? flujoVolumetrico.toFixed(2) : ''}
      </TableCell>
    </TableRow>
  );
};

const PermeabilityFooter = ({ control }: { control: Control<PermeabilityFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const {
    promedioFlujoVolumetrico,
    desviacionFlujoVolumetrico
  } = useMemo(() => {
    if (!samples) return { promedioFlujoVolumetrico: 0, desviacionFlujoVolumetrico: 0 };
    
    const flujosVolumetricos = samples.map(s => calculateVolumetricFlow(s.flujoMms)).filter(f => f > 0);
    
    return {
      promedioFlujoVolumetrico: calculateAverage(flujosVolumetricos),
      desviacionFlujoVolumetrico: calculateStdDev(flujosVolumetricos),
    };
  }, [samples]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={2}>Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioFlujoVolumetrico > 0 ? promedioFlujoVolumetrico.toFixed(2) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={2}>Desv. Est.</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionFlujoVolumetrico > 0 ? desviacionFlujoVolumetrico.toExponential(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export function PermeabilityForm() {
  const form = useForm<PermeabilityFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN ISO 7231',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      samples: Array(3).fill(null).map(() => ({ ...initialSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: PermeabilityFormValues) => {
    console.log("Datos del formulario de Permeabilidad:", data);
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
                    <Input placeholder="Ej: INEN ISO 7231" {...field} />
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
            <FormItem className="md:col-span-2 lg:col-span-3">
                <FormLabel>Dimensiones de la probeta</FormLabel>
                <p className="text-sm text-muted-foreground pt-2">(50 ± 0,05) mm × (50 ± 0,05) mm × (25 ± 0,05) mm</p>
            </FormItem>
            <FormItem className="md:col-span-2 lg:col-span-3">
                <FormLabel>Características de la muestra</FormLabel>
                <p className="text-sm text-muted-foreground pt-2">Sin piel, ausencia de anisotropía en la muestra.</p>
            </FormItem>
            <FormItem className="md:col-span-2 lg:col-span-3">
                <FormLabel>Tipo de aparato y dirección de presión</FormLabel>
                <p className="text-sm text-muted-foreground pt-2">Aparato de flujo de aire utilizando presión de aire por encima de la atmosférica.</p>
            </FormItem>
        </div>
        <div className="overflow-x-auto rounded-lg border max-w-xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">Muestra</TableHead>
                <TableHead className="text-center">Velocidad de Flujo (mm/s)</TableHead>
                <TableHead className="text-center">Flujo volumétrico (dm³/s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <PermeabilityRow key={field.id} control={form.control} index={index} setFocus={form.setFocus} totalSamples={fields.length} />
              ))}
            </TableBody>
            <PermeabilityFooter control={form.control} />
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
      </form>
    </Form>
  );
}

    