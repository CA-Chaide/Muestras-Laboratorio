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
import { Form, FormControl, FormField } from '@/components/ui/form';
import { useMemo } from 'react';

type SampleData = {
  peso: number | string;
  largo: { med1: number | string; med2: number | string; med3: number | string; };
  ancho: { med1: number | string; med2: number | string; med3: number | string; };
  espesor: { med1: number | string; med2: number | string; med3: number | string; };
};

export type DensityFormValues = {
  samples: SampleData[];
};

const initialSampleValues: SampleData = {
  peso: '',
  largo: { med1: '', med2: '', med3: '' },
  ancho: { med1: '', med2: '', med3: '' },
  espesor: { med1: '', med2: '', med3: '' },
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

function calculateStdDev(values: number[]) {
  const n = values.length;
  if (n < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (n - 1);
  return Math.sqrt(variance);
}

const DensityRow = ({ control, index }: { control: Control<DensityFormValues>, index: number }) => {
    const values = useWatch({
      control,
      name: `samples.${index}`,
    });

    const promedioLargo = useMemo(() => calculateAverage([values.largo.med1, values.largo.med2, values.largo.med3]), [values.largo]);
    const promedioAncho = useMemo(() => calculateAverage([values.ancho.med1, values.ancho.med2, values.ancho.med3]), [values.ancho]);
    const promedioEspesor = useMemo(() => calculateAverage([values.espesor.med1, values.espesor.med2, values.espesor.med3]), [values.espesor]);
    const densidad = useMemo(() => calculateDensity(values.peso, promedioLargo, promedioAncho, promedioEspesor), [values.peso, promedioLargo, promedioAncho, promedioEspesor]);

    return (
        <TableRow>
            <TableCell className="text-center font-medium align-middle p-2">{index + 1}</TableCell>
            <TableCell className="p-1">
                <FormField control={control} name={`samples.${index}.peso`} render={({ field }) => <Input type="number" step="any" {...field} className="w-20" />} />
            </TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.med1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.med2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.largo.med3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioLargo > 0 ? promedioLargo.toFixed(2) : ''}</TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.med1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.med2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.ancho.med3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioAncho > 0 ? promedioAncho.toFixed(2) : ''}</TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.med1`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.med2`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="p-1"><FormField control={control} name={`samples.${index}.espesor.med3`} render={({ field }) => <Input type="number" step="any" {...field} className="w-16" />} /></TableCell>
            <TableCell className="text-center align-middle p-2">{promedioEspesor > 0 ? promedioEspesor.toFixed(2) : ''}</TableCell>
            <TableCell className="text-center align-middle font-bold bg-secondary p-2">{densidad > 0 ? densidad.toFixed(2) : ''}</TableCell>
        </TableRow>
    )
}

const DensityFooter = ({ control } : { control: Control<DensityFormValues> }) => {
    const samples = useWatch({ control, name: 'samples' });

    const { promedioDensidad, desviacion } = useMemo(() => {
        if (!samples) return { promedioDensidad: 0, desviacion: 0 };
        const densidades = samples.map((sample) => {
            const promedioLargo = calculateAverage([sample.largo.med1, sample.largo.med2, sample.largo.med3]);
            const promedioAncho = calculateAverage([sample.ancho.med1, sample.ancho.med2, sample.ancho.med3]);
            const promedioEspesor = calculateAverage([sample.espesor.med1, sample.espesor.med2, sample.espesor.med3]);
            return calculateDensity(sample.peso, promedioLargo, promedioAncho, promedioEspesor);
        }).filter((d: number) => d > 0);
        
        const desviacion = calculateStdDev(densidades);
        const promedioDensidad = calculateAverage(densidades);

        return { promedioDensidad, desviacion };
    }, [samples]);

    return (
        <TableRow>
            <TableCell colSpan={14} className="text-right font-bold align-middle p-2">Promedio / Desviación</TableCell>
            <TableCell className="text-center align-middle font-bold bg-secondary p-2">{promedioDensidad > 0 ? promedioDensidad.toFixed(2) : ''}</TableCell>
            <TableCell className="text-center align-middle font-bold bg-destructive/20 p-2">{desviacion > 0 ? desviacion.toFixed(2) : ''}</TableCell>
        </TableRow>
    )
}

export function DensityForm() {
  const form = useForm<DensityFormValues>({
    defaultValues: {
      samples: Array(5).fill(null).map(() => ({ ...initialSampleValues })),
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
                <TableHead rowSpan={2} className="text-center align-middle p-2 border-l">Desv</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center p-1">Med1</TableHead>
                <TableHead className="text-center p-1">Med2</TableHead>
                <TableHead className="text-center p-1">Med3</TableHead>
                <TableHead className="text-center border-r p-1">Promedio</TableHead>
                <TableHead className="text-center p-1">Med1</TableHead>
                <TableHead className="text-center p-1">Med2</TableHead>
                <TableHead className="text-center p-1">Med3</TableHead>
                <TableHead className="text-center border-r p-1">Promedio</TableHead>
                <TableHead className="text-center p-1">Med1</TableHead>
                <TableHead className="text-center p-1">Med2</TableHead>
                <TableHead className="text-center p-1">Med3</TableHead>
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
        <div className="flex justify-end">
            <Button type="submit" className="mt-4">Guardar Datos de Ensayo</Button>
        </div>
      </form>
    </Form>
  );
}
