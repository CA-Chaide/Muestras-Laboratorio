'use client';

import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
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
import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type DimensionData = {
  pos1: number | string;
  pos2: number | string;
  pos3: number | string;
};

type SampleData = {
  peso: number | string;
  largo: DimensionData;
  ancho: DimensionData;
  espesor: DimensionData;
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
  largo: { pos1: '', pos2: '', pos3: '' },
  ancho: { pos1: '', pos2: '', pos3: '' },
  espesor: { pos1: '', pos2: '', pos3: '' },
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

const DensityRow = ({ control, index }: { control: Control<DensityFormValues>, index: number }) => {
    const values = useWatch({
      control,
      name: `samples.${index}`,
    });

    const promedioLargo = useMemo(() => calculateAverage([values.largo.pos1, values.largo.pos2, values.largo.pos3]), [values.largo]);
    const promedioAncho = useMemo(() => calculateAverage([values.ancho.pos1, values.ancho.pos2, values.ancho.pos3]), [values.ancho]);
    const promedioEspesor = useMemo(() => calculateAverage([values.espesor.pos1, values.espesor.pos2, values.espesor.pos3]), [values.espesor]);
    const densidad = useMemo(() => calculateDensity(values.peso, promedioLargo, promedioAncho, promedioEspesor), [values.peso, promedioLargo, promedioAncho, promedioEspesor]);

    return (
        <TableRow>
            <TableCell className="text-center font-medium align-middle p-2">{index + 1}</TableCell>
            <TableCell className="p-1">
                <FormField control={control} name={`samples.${index}.peso`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} />
            </TableCell>
            {/* Largo */}
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.pos1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.pos2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.pos3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioLargo > 0 ? promedioLargo.toFixed(2) : ''}</TableCell>
            {/* Ancho */}
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.pos1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.pos2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.pos3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioAncho > 0 ? promedioAncho.toFixed(2) : ''}</TableCell>
            {/* Espesor */}
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.pos1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.pos2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.pos3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-14" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioEspesor > 0 ? promedioEspesor.toFixed(2) : ''}</TableCell>
            <TableCell className="text-center align-middle font-bold bg-secondary p-2">{densidad > 0 ? densidad.toFixed(2) : ''}</TableCell>
        </TableRow>
    )
}

const DensityFooter = ({ control } : { control: Control<DensityFormValues> }) => {
    const samples = useWatch({ control, name: 'samples' });

    const { promedioDensidad, desviacionEstandar } = useMemo(() => {
        if (!samples) return { promedioDensidad: 0, desviacionEstandar: 0 };
        const densidades = samples.map((sample) => {
            const promedioLargo = calculateAverage([sample.largo.pos1, sample.largo.pos2, sample.largo.pos3]);
            const promedioAncho = calculateAverage([sample.ancho.pos1, sample.ancho.pos2, sample.ancho.pos3]);
            const promedioEspesor = calculateAverage([sample.espesor.pos1, sample.espesor.pos2, sample.espesor.pos3]);
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
                <TableCell colSpan={14} className="text-right font-bold align-middle p-2">Promedio</TableCell>
                <TableCell className="text-center align-middle font-bold bg-secondary p-2">{promedioDensidad > 0 ? promedioDensidad.toFixed(2) : ''}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={14} className="text-right font-bold align-middle p-2">Desviación Estándar</TableCell>
                <TableCell className="text-center align-middle font-bold bg-secondary p-2">{desviacionEstandar > 0 ? desviacionEstandar.toFixed(2) : ''}</TableCell>
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
                    <Input type="number" step="any" placeholder="Ej: 50" {...field} />
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
                <TableHead rowSpan={2} className="text-center align-middle p-2">Peso (g)</TableHead>
                <TableHead colSpan={4} className="text-center border-l border-r p-1">Largo (mm)</TableHead>
                <TableHead colSpan={4} className="text-center border-l border-r p-1">Ancho (mm)</TableHead>
                <TableHead colSpan={4} className="text-center border-l border-r p-1">Espesor (mm)</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle p-2 border-l">Densidad (kg/m³)</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center p-1">Pos1</TableHead>
                <TableHead className="text-center p-1">Pos2</TableHead>
                <TableHead className="text-center p-1">Pos3</TableHead>
                <TableHead className="text-center border-r p-1">Promedio</TableHead>
                <TableHead className="text-center p-1">Pos1</TableHead>
                <TableHead className="text-center p-1">Pos2</TableHead>
                <TableHead className="text-center p-1">Pos3</TableHead>
                <TableHead className="text-center border-r p-1">Promedio</TableHead>
                <TableHead className="text-center p-1">Pos1</TableHead>
                <TableHead className="text-center p-1">Pos2</TableHead>
                <TableHead className="text-center p-1">Pos3</TableHead>
                <TableHead className="text-center border-r p-1">Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <DensityRow key={field.id} control={form.control} index={index} />
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
