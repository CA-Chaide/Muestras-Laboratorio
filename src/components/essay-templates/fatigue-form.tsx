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
import { useMemo, useEffect } from 'react';
import { format, addDays } from 'date-fns';
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

function calculateAverageWithNegatives(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v));
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return sum / validValues.length;
}

function calculateStdDevWithNegatives(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v));
  const n = validValues.length;
  if (n < 2) return 0;
  const mean = calculateAverageWithNegatives(validValues);
  const sumOfSquaredDiffs = validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumOfSquaredDiffs / (n - 1));
}

const FatigueRow = ({ control, index }: { 
  control: Control<FatigueFormValues>, 
  index: number 
}) => {
  const values = useWatch({
    control,
    name: `samples.${index}`,
  });

  const perdidaEspesor = useMemo(() => {
    const inicial = Number(values.espesorInicial);
    const final = Number(values.espesorFinal);
    if (!inicial || inicial <= 0 || isNaN(final)) return 0;
    return ((inicial - final) / inicial) * 100;
  }, [values.espesorInicial, values.espesorFinal]);

  const perdidaDureza = useMemo(() => {
    const inicial = Number(values.durezaInicial);
    const final = Number(values.durezaFinal);
    if (!inicial || inicial <= 0 || isNaN(final)) return 0;
    return ((inicial - final) / inicial) * 100;
  }, [values.durezaInicial, values.durezaFinal]);

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
      <TableCell className="text-center bg-muted p-2 align-middle">
        {perdidaEspesor ? perdidaEspesor.toFixed(1) : ''}
      </TableCell>
      <TableCell className="text-center bg-muted p-2 align-middle">
        {perdidaDureza ? perdidaDureza.toFixed(1) : ''}
      </TableCell>
    </TableRow>
  );
};

const FatigueFooter = ({ control }: { control: Control<FatigueFormValues> }) => {
  const samples = useWatch({ control, name: 'samples' });

  const {
    promedioPerdidaEspesor,
    desviacionPerdidaEspesor,
    promedioPerdidaDureza,
    desviacionPerdidaDureza
  } = useMemo(() => {
    if (!samples) return { 
        promedioPerdidaEspesor: 0, desviacionPerdidaEspesor: 0, promedioPerdidaDureza: 0, desviacionPerdidaDureza: 0
    };
    
    const perdidasEspesor = samples.map(s => {
        const inicial = Number(s.espesorInicial);
        const final = Number(s.espesorFinal);
        if (!inicial || inicial <= 0 || isNaN(final)) return NaN;
        return ((inicial - final) / inicial) * 100;
    }).filter(v => !isNaN(v));

    const perdidasDureza = samples.map(s => {
        const inicial = Number(s.durezaInicial);
        const final = Number(s.durezaFinal);
        if (!inicial || inicial <= 0 || isNaN(final)) return NaN;
        return ((inicial - final) / inicial) * 100;
    }).filter(v => !isNaN(v));
    
    return {
      promedioPerdidaEspesor: calculateAverageWithNegatives(perdidasEspesor),
      desviacionPerdidaEspesor: calculateStdDevWithNegatives(perdidasEspesor),
      promedioPerdidaDureza: calculateAverageWithNegatives(perdidasDureza),
      desviacionPerdidaDureza: calculateStdDevWithNegatives(perdidasDureza),
    };
  }, [samples]);

  return (
    <TableFooter>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={5}>Promedio</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioPerdidaEspesor ? promedioPerdidaEspesor.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {promedioPerdidaDureza ? promedioPerdidaDureza.toFixed(2) : ''}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-right font-bold p-2 align-middle" colSpan={5}>Desv. Est.</TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionPerdidaEspesor ? desviacionPerdidaEspesor.toFixed(2) : ''}
        </TableCell>
        <TableCell className="text-center font-bold bg-secondary p-2 align-middle">
          {desviacionPerdidaDureza ? desviacionPerdidaDureza.toFixed(2) : ''}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

interface FatigueFormProps {
    initialHardnessValues?: { espesor: number | string; dureza: number | string; }[];
}

export function FatigueForm({ initialHardnessValues }: FatigueFormProps) {
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

  const fechaInicio = form.watch('fechaInicio');
  const fechaFinalizacion = useMemo(() => {
    if (fechaInicio) {
      return addDays(fechaInicio, 1);
    }
    return null;
  }, [fechaInicio]);

  useEffect(() => {
    if (initialHardnessValues) {
      const currentSamples = form.getValues('samples');
      const updatedSamples = currentSamples.map((sample, index) => {
        if (index < initialHardnessValues.length) {
          const hardnessSample = initialHardnessValues[index];
          return {
            ...sample,
            espesorInicial: sample.espesorInicial || hardnessSample.espesor,
            durezaInicial: sample.durezaInicial || hardnessSample.dureza,
          };
        }
        return sample;
      });
      
      if (JSON.stringify(updatedSamples) !== JSON.stringify(currentSamples)) {
        form.setValue('samples', updatedSamples);
      }
    }
  }, [initialHardnessValues, form]);

  const onSubmit = (data: FatigueFormValues) => {
    console.log("Datos del formulario de Fatiga:", data);
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
            <FormItem className="flex flex-col pt-2">
                <FormLabel>Fecha de finalización</FormLabel>
                <FormControl>
                    <Input
                        readOnly
                        value={fechaFinalizacion ? format(fechaFinalizacion, 'PPP', { locale: es }) : ''}
                    />
                </FormControl>
            </FormItem>
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
                <FormItem className="md:col-span-2 lg:col-span-4">
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
                <TableHead className="text-center">Espesor inicial (mm)</TableHead>
                <TableHead className="text-center">Dureza -40% inicial (N)</TableHead>
                <TableHead className="text-center">Espesor final (mm)</TableHead>
                <TableHead className="text-center">Dureza -40% final (N)</TableHead>
                <TableHead className="text-center">% Pérdida de Espesor</TableHead>
                <TableHead className="text-center">% Pérdida de Dureza</TableHead>
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
