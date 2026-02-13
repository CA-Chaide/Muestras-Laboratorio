'use client';

import { useForm, useFieldArray, useWatch, Control, UseFormReturn } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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

type NineMeasurements = {
  m1: number | string; m2: number | string; m3: number | string;
  m4: number | string; m5: number | string; m6: number | string;
  m7: number | string; m8: number | string; m9: number | string;
};

type SampleData = {
  peso: number | string;
  largo: NineMeasurements;
  ancho: NineMeasurements;
  espesor: NineMeasurements;
};

export type DensityFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  juegoEquipo: string;
  temperatura: string;
  humedadRelativa: string;
  metodo: string;
  acondicionamiento: string;
  samples: SampleData[];
  observacionesDesviaciones: string;
};

const initialSampleValues: SampleData = {
  peso: '',
  largo: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '' },
  ancho: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '' },
  espesor: { m1: '', m2: '', m3: '', m4: '', m5: '', m6: '', m7: '', m8: '', m9: '' },
};

function calculateAverage(values: (number | string)[]) {
  const validValues = values.map(Number).filter((v) => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((a, b) => a + b, 0);
  return sum / validValues.length;
}

function calculateDensity(peso: number | string, largo: number, ancho: number, espesor: number) {
  const numPeso = Number(peso);
  if (!numPeso || numPeso <= 0 || !largo || largo <= 0 || !ancho || ancho <= 0 || !espesor || espesor <= 0) {
    return 0;
  }
  const volumen = largo * ancho * espesor; // in mm^3
  if (volumen === 0) return 0;
  // (peso in g) / (volumen in mm^3) * 1000000 -> kg/m^3
  return (numPeso / volumen) * 1000000;
}

const DensityRow = ({ control, index, setFocus, totalSamples }: { 
  control: Control<DensityFormValues>, 
  index: number,
  setFocus: UseFormReturn<DensityFormValues>['setFocus'],
  totalSamples: number
}) => {
    const values = useWatch({
      control,
      name: `samples.${index}`,
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const { name } = e.currentTarget;
      const nameParts = name.split('.'); 
      const currentSampleIndex = parseInt(nameParts[1], 10);
      const dimension = nameParts[2] as 'peso' | 'largo' | 'ancho' | 'espesor';
      const measurement = nameParts[3]; // 'm1', 'm2', etc.

      const dimensionsWithMeasurements: ('largo' | 'ancho' | 'espesor')[] = ['largo', 'ancho', 'espesor'];

      if (dimension === 'peso') {
          setFocus(`samples.${currentSampleIndex}.largo.m1`);
          return;
      }

      if (dimensionsWithMeasurements.includes(dimension)) {
          const measurementNumber = parseInt(measurement.substring(1));
          const currentDimensionIndex = dimensionsWithMeasurements.indexOf(dimension);
          
          if (measurementNumber < 9) {
              setFocus(`samples.${currentSampleIndex}.${dimension}.m${measurementNumber + 1}`);
          } else { // Last measurement of a grid
              if (currentDimensionIndex < dimensionsWithMeasurements.length - 1) {
                  // Move to the next dimension's first measurement
                  const nextDimension = dimensionsWithMeasurements[currentDimensionIndex + 1];
                  setFocus(`samples.${currentSampleIndex}.${nextDimension}.m1`);
              } else {
                  // Last dimension, move to next sample
                  if (currentSampleIndex < totalSamples - 1) {
                      setFocus(`samples.${currentSampleIndex + 1}.peso`);
                  }
              }
          }
      }
    };

    const promedioLargo = useMemo(() => Math.round(calculateAverage(Object.values(values.largo))), [values.largo]);
    const promedioAncho = useMemo(() => Math.round(calculateAverage(Object.values(values.ancho))), [values.ancho]);
    const promedioEspesor = useMemo(() => Math.round(calculateAverage(Object.values(values.espesor)) / 0.2) * 0.2, [values.espesor]);
    const densidad = useMemo(() => calculateDensity(values.peso, promedioLargo, promedioAncho, promedioEspesor), [values.peso, promedioLargo, promedioAncho, promedioEspesor]);

    const renderMeasurementInputs = (dimension: 'largo' | 'ancho' | 'espesor') => (
        <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, i) => `m${i + 1}`).map((fieldName) => (
                <FormField
                    key={fieldName}
                    control={control}
                    name={`samples.${index}.${dimension}.${fieldName as keyof NineMeasurements}`}
                    render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />}
                />
            ))}
        </div>
    );

    return (
        <TableRow>
            <TableCell className="text-center font-medium align-middle p-2">{index + 1}</TableCell>
            <TableCell className="p-2 align-middle min-w-[120px]">
                <FormField control={control} name={`samples.${index}.peso`} render={({ field }) => <Input type="number" step="any" min="0" {...field} onKeyDown={handleKeyDown} />} />
            </TableCell>
            
            <TableCell className="p-2 min-w-[280px]">{renderMeasurementInputs('largo')}</TableCell>
            <TableCell className="text-center align-middle p-2">{promedioLargo > 0 ? promedioLargo : ''}</TableCell>
            
            <TableCell className="p-2 min-w-[280px]">{renderMeasurementInputs('ancho')}</TableCell>
            <TableCell className="text-center align-middle p-2">{promedioAncho > 0 ? promedioAncho : ''}</TableCell>
            
            <TableCell className="p-2 min-w-[280px]">{renderMeasurementInputs('espesor')}</TableCell>
            <TableCell className="text-center align-middle p-2">{promedioEspesor > 0 ? promedioEspesor.toFixed(2) : ''}</TableCell>
            
            <TableCell className="text-center align-middle font-bold bg-secondary p-2">{densidad > 0 ? densidad.toFixed(1) : ''}</TableCell>
        </TableRow>
    )
}

const DensityFooter = ({ control } : { control: Control<DensityFormValues> }) => {
    const samples = useWatch({ control, name: 'samples' });

    const { promedioDensidad, desviacionEstandar } = useMemo(() => {
        if (!samples) return { promedioDensidad: 0, desviacionEstandar: 0 };
        const densidades = samples.map((sample) => {
            const promedioLargo = Math.round(calculateAverage(Object.values(sample.largo)));
            const promedioAncho = Math.round(calculateAverage(Object.values(sample.ancho)));
            const promedioEspesor = Math.round(calculateAverage(Object.values(sample.espesor)) / 0.2) * 0.2;
            return calculateDensity(sample.peso, promedioLargo, promedioAncho, promedioEspesor);
        }).filter((d: number) => d > 0);
        
        const promedioDensidad = calculateAverage(densidades);
        
        const n = densidades.length;
        if (n < 2) {
            return { promedioDensidad, desviacionEstandar: 0 };
        }
        const mean = promedioDensidad;
        const sumOfSquaredDiffs = densidades.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        const desviacionEstandar = Math.sqrt(sumOfSquaredDiffs / (n - 1));

        return { promedioDensidad, desviacionEstandar };
    }, [samples]);

    return (
        <>
            <TableRow>
                <TableCell colSpan={8} className="text-right font-bold align-middle p-2">Promedio</TableCell>
                <TableCell className="text-center align-middle font-bold bg-secondary p-2">{promedioDensidad > 0 ? promedioDensidad.toFixed(1) : ''}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={8} className="text-right font-bold align-middle p-2">Desviación Estándar</TableCell>
                <TableCell className="text-center align-middle font-bold bg-secondary p-2">{desviacionEstandar > 0 ? Number(desviacionEstandar.toPrecision(2)).toString() : ''}</TableCell>
            </TableRow>
        </>
    )
}

export function DensityForm() {
  const form = useForm<DensityFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      juegoEquipo: '1',
      temperatura: '',
      humedadRelativa: '',
      metodo: 'INEN-ISO 845:2014',
      acondicionamiento: '16 h, temperatura: 23°C ± 2°C, humedad relativa: 50% ± 5%',
      samples: Array(5).fill(null).map(() => ({ ...initialSampleValues })),
      observacionesDesviaciones: '',
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });

  const onSubmit = (data: DensityFormValues) => {
    console.log("Datos del formulario de Densidad:", data);
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
              name="juegoEquipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Juego de equipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un juego" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Ej: INEN-ISO 845:2014" {...field} />
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
                <TableHead rowSpan={2} className="text-center align-middle p-2">Muestra</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle p-2 min-w-[120px]">Peso (g)</TableHead>
                <TableHead colSpan={2} className="text-center border-l p-2 min-w-[280px]">Largo (mm)</TableHead>
                <TableHead colSpan={2} className="text-center border-l p-2 min-w-[280px]">Ancho (mm)</TableHead>
                <TableHead colSpan={2} className="text-center border-l border-r p-2 min-w-[280px]">Espesor (mm)</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle p-2 border-l">Densidad (kg/m³)</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center p-2 border-l">Mediciones</TableHead>
                <TableHead className="text-center p-2">Promedio</TableHead>
                <TableHead className="text-center p-2 border-l">Mediciones</TableHead>
                <TableHead className="text-center p-2">Promedio</TableHead>
                <TableHead className="text-center p-2 border-l">Mediciones</TableHead>
                <TableHead className="text-center p-2 border-r">Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <DensityRow key={field.id} control={form.control} index={index} setFocus={form.setFocus} totalSamples={fields.length} />
              ))}
                <DensityFooter control={form.control} />
            </TableBody>
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

    