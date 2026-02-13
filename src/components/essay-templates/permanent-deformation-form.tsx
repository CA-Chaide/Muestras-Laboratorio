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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type NineMeasurements = {
  m1: number | string; m2: number | string; m3: number | string;
  m4: number | string; m5: number | string; m6: number | string;
  m7: number | string; m8: number | string; m9: number | string;
};

type SampleData = {
  espesorInicial: NineMeasurements;
  espesorFinal: NineMeasurements;
};

export type PermanentDeformationFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  porcentajeCompresion: string;
  tiempoCompresion: string;
  temperaturaCompresion: string;
  tiempoRecuperacion: string;
  samples: SampleData[];
  observacionesDesviaciones: string;
};

const initialSampleValues: SampleData = {
  espesorInicial: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '' },
  espesorFinal: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '' },
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

function calculateDeformation(initial: number | string, final: number | string) {
    const numInitial = Number(initial);
    const numFinal = Number(final);
    if (!numInitial || numInitial <= 0 || isNaN(numFinal) || numFinal <= 0) return 0;
    return ((numInitial - numFinal) / numInitial) * 100;
}

const PermanentDeformationRow = ({ control, index }: { control: Control<PermanentDeformationFormValues>, index: number }) => {
  const values = useWatch({
    control,
    name: `samples.${index}`,
  });

  const renderMeasurementInputs = (dimension: 'espesorInicial' | 'espesorFinal') => (
    <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => `m${i + 1}`).map((fieldName) => (
            <FormField
                key={fieldName}
                control={control}
                name={`samples.${index}.${dimension}.${fieldName as keyof NineMeasurements}`}
                render={({ field }) => <Input type="number" step="any" min="0" {...field} />}
            />
        ))}
    </div>
  );

  const promedioEspesorInicial = useMemo(() => calculateAverage(Object.values(values.espesorInicial)), [values.espesorInicial]);
  const promedioEspesorFinal = useMemo(() => calculateAverage(Object.values(values.espesorFinal)), [values.espesorFinal]);
  
  const deformacion = useMemo(() => {
    return calculateDeformation(promedioEspesorInicial, promedioEspesorFinal);
  }, [promedioEspesorInicial, promedioEspesorFinal]);

  return (
    <TableRow>
      <TableCell className="text-center font-medium p-2 align-middle">{index + 1}</TableCell>
      <TableCell className="p-2 align-middle min-w-[280px]">
        {renderMeasurementInputs('espesorInicial')}
      </TableCell>
      <TableCell className="text-center align-middle p-2">{promedioEspesorInicial > 0 ? promedioEspesorInicial.toFixed(2) : ''}</TableCell>
      <TableCell className="p-2 align-middle min-w-[280px]">
        {renderMeasurementInputs('espesorFinal')}
      </TableCell>
      <TableCell className="text-center align-middle p-2">{promedioEspesorFinal > 0 ? promedioEspesorFinal.toFixed(2) : ''}</TableCell>
      <TableCell className="text-center bg-muted p-2 align-middle font-bold">
        {deformacion > 0 ? deformacion.toFixed(1) : ''}
      </TableCell>
    </TableRow>
  );
};

const PermanentDeformationFooter = ({ control }: { control: Control<PermanentDeformationFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const { averageDeformation, stdDevDeformation } = useMemo(() => {
    if (!samples) return { averageDeformation: 0, stdDevDeformation: 0 };
    
    const deformations = samples.map(s => {
        const promedioInicial = calculateAverage(Object.values(s.espesorInicial));
        const promedioFinal = calculateAverage(Object.values(s.espesorFinal));
        return calculateDeformation(promedioInicial, promedioFinal);
    }).filter(d => d > 0);
    
    return {
      averageDeformation: calculateAverage(deformations as any),
      stdDevDeformation: calculateStdDev(deformations as any),
    };
  }, [samples]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold" colSpan={5}>Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary">
          {averageDeformation > 0 ? averageDeformation.toFixed(1) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold" colSpan={5}>Desviación Estándar</TableCell>
        <TableCell className="text-center font-bold bg-secondary">
          {stdDevDeformation > 0 ? stdDevDeformation.toFixed(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export function PermanentDeformationForm() {
  const form = useForm<PermanentDeformationFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 1856:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      porcentajeCompresion: '50',
      tiempoCompresion: '22',
      temperaturaCompresion: '70',
      tiempoRecuperacion: '30',
      samples: Array(5).fill(null).map(() => JSON.parse(JSON.stringify(initialSampleValues))),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: PermanentDeformationFormValues) => {
    console.log("Datos del formulario de Deformación Remanente:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-4 border rounded-lg">
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
              name="porcentajeCompresion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>% Compresión</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tiempoCompresion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo Compresión (h)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 22" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="temperaturaCompresion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temp. Compresión (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 70" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tiempoRecuperacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo Recuperación (min)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 30" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metodo"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Método</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: INEN-ISO 1856:2014" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acondicionamiento"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Acondicionamiento de muestra</FormLabel>
                  <FormControl>
                    <Input placeholder="16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>
        <div className="overflow-x-auto rounded-lg border max-w-5xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="text-center align-middle p-2">Muestra</TableHead>
                <TableHead colSpan={2} className="text-center border-l p-2">Espesor inicial (mm)</TableHead>
                <TableHead colSpan={2} className="text-center border-l p-2">Espesor final (mm)</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border-l p-2">Deformación Remanente (%)</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center p-2 border-l">Mediciones</TableHead>
                <TableHead className="text-center p-2">Promedio</TableHead>
                <TableHead className="text-center p-2 border-l">Mediciones</TableHead>
                <TableHead className="text-center p-2">Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <PermanentDeformationRow key={field.id} control={form.control} index={index} />
              ))}
            </TableBody>
            <PermanentDeformationFooter control={form.control} />
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
