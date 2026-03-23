'use client';

import { useForm, useWatch, Control, UseFormReturn } from 'react-hook-form';
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
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type TractionRowData = {
  velocidad: string;
  tension: string;
  estado: string;
  anchura: string;
  f1: string;
  f2: string;
  f3: string;
  f4: string;
  f5: string;
  elongacion: string;
};

export type WovenTractionFormValues = {
  fechaInicio: Date;
  horaInicio: string;
  metodo: string;
  acondicionamiento: string;
  urdiembre: TractionRowData;
  trama: TractionRowData;
  observacionesDesviaciones: string;
};

const initialRowValues: TractionRowData = {
  velocidad: '',
  tension: '',
  estado: '',
  anchura: '',
  f1: '',
  f2: '',
  f3: '',
  f4: '',
  f5: '',
  elongacion: '',
};

function calculateAverage(values: (string | number)[]) {
  const nums = values.map(v => Number(v)).filter(n => !isNaN(n) && n > 0);
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const TractionSenseRow = ({
  control,
  sense,
  label,
  setFocus
}: {
  control: Control<WovenTractionFormValues>,
  sense: 'urdiembre' | 'trama',
  label: string,
  setFocus: UseFormReturn<WovenTractionFormValues>['setFocus']
}) => {
  const values = useWatch({
    control,
    name: sense,
  });

  const fieldsOrder: (keyof TractionRowData)[] = [
    'velocidad', 'tension', 'estado', 'anchura', 'f1', 'f2', 'f3', 'f4', 'f5', 'elongacion'
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    const nameParts = name.split('.');
    const fieldName = nameParts[1] as keyof TractionRowData;
    const currentIndex = fieldsOrder.indexOf(fieldName);

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < fieldsOrder.length - 1) {
        setFocus(`${sense}.${fieldsOrder[currentIndex + 1]}`);
      } else if (sense === 'urdiembre') {
        setFocus('trama.velocidad');
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        setFocus(`${sense}.${fieldsOrder[currentIndex - 1]}`);
      } else if (sense === 'trama') {
        setFocus('urdiembre.elongacion');
      }
    }
  };

  const promedioFuerza = useMemo(() => {
    return calculateAverage([values.f1, values.f2, values.f3, values.f4, values.f5]);
  }, [values.f1, values.f2, values.f3, values.f4, values.f5]);

  return (
    <TableRow>
      <TableCell className="font-bold text-center bg-muted/30 text-xs">{label}</TableCell>
      <TableCell className="p-1">
        <FormField control={control} name={`${sense}.velocidad`} render={({ field }) => <Input {...field} onKeyDown={handleKeyDown} className="h-8 text-[11px] text-center" />} />
      </TableCell>
      <TableCell className="p-1">
        <FormField control={control} name={`${sense}.tension`} render={({ field }) => <Input {...field} onKeyDown={handleKeyDown} className="h-8 text-[11px] text-center" />} />
      </TableCell>
      <TableCell className="p-1">
        <FormField control={control} name={`${sense}.estado`} render={({ field }) => <Input {...field} onKeyDown={handleKeyDown} className="h-8 text-[11px] text-center" />} />
      </TableCell>
      <TableCell className="p-1">
        <FormField control={control} name={`${sense}.anchura`} render={({ field }) => <Input {...field} onKeyDown={handleKeyDown} className="h-8 text-[11px] text-center" />} />
      </TableCell>
      {[1, 2, 3, 4, 5].map((num) => (
        <TableCell key={num} className="p-1">
          <FormField
            control={control}
            name={`${sense}.f${num}` as any}
            render={({ field }) => (
              <Input
                type="number"
                step="any"
                {...field}
                onKeyDown={handleKeyDown}
                className="h-8 text-[11px] text-center font-medium"
              />
            )}
          />
        </TableCell>
      ))}
      <TableCell className="text-center font-bold bg-secondary/20 text-[11px]">
        {promedioFuerza > 0 ? promedioFuerza.toFixed(1) : '-'}
      </TableCell>
      <TableCell className="p-1">
        <FormField
          control={control}
          name={`${sense}.elongacion`}
          render={({ field }) => (
            <Input
              type="number"
              step="any"
              {...field}
              onKeyDown={handleKeyDown}
              className="h-8 text-[11px] text-center font-bold text-primary"
            />
          )}
        />
      </TableCell>
    </TableRow>
  );
};

export function WovenTractionForm() {
  const form = useForm<WovenTractionFormValues>({
    defaultValues: {
      fechaInicio: new Date(),
      horaInicio: format(new Date(), 'HH:mm'),
      metodo: 'ASTM D5034',
      acondicionamiento: '24 h, temperatura: 21°C ± 1°C, humedad relativa: 65% ± 2%',
      urdiembre: { ...initialRowValues },
      trama: { ...initialRowValues },
      observacionesDesviaciones: '',
    },
  });

  const onSubmit = (data: WovenTractionFormValues) => {
    console.log("Woven Traction Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-card shadow-sm">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-semibold">Fecha inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal h-8 text-xs',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PP', { locale: es }) : <span>Seleccionar</span>}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                <FormLabel className="text-xs font-semibold">Hora inicio</FormLabel>
                <FormControl><Input type="time" {...field} className="h-8 text-xs" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metodo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Método de ensayo</FormLabel>
                <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acondicionamiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Acondicionamiento</FormLabel>
                <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase tracking-wider bg-muted/50 font-bold">
                <TableHead className="w-[120px] text-center border-r">Sentido</TableHead>
                <TableHead className="text-center min-w-[100px]">Velocidad Alarg. (mm/min)</TableHead>
                <TableHead className="text-center min-w-[100px]">Tensión Previa (N)</TableHead>
                <TableHead className="text-center min-w-[100px]">Estado Probetas</TableHead>
                <TableHead className="text-center min-w-[100px]">Anchura Tiras (mm)</TableHead>
                <TableHead className="text-center border-l" colSpan={5}>Resultados Fuerza (N)</TableHead>
                <TableHead className="text-center border-l bg-secondary/10">Promedio (N)</TableHead>
                <TableHead className="text-center border-l text-primary">Elongación (%)</TableHead>
              </TableRow>
              <TableRow className="text-[9px] bg-muted/20">
                <TableHead className="border-r"></TableHead>
                <TableHead colSpan={4}></TableHead>
                <TableHead className="text-center border-l">F1</TableHead>
                <TableHead className="text-center">F2</TableHead>
                <TableHead className="text-center">F3</TableHead>
                <TableHead className="text-center">F4</TableHead>
                <TableHead className="text-center">F5</TableHead>
                <TableHead className="border-l"></TableHead>
                <TableHead className="border-l"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TractionSenseRow control={form.control} sense="urdiembre" label="URDIEMBRE" setFocus={form.setFocus} />
              <TractionSenseRow control={form.control} sense="trama" label="TRAMA" setFocus={form.setFocus} />
            </TableBody>
          </Table>
        </div>

        <FormField
          control={form.control}
          name="observacionesDesviaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Observaciones / Desviaciones</FormLabel>
              <FormControl><Textarea {...field} placeholder="Registre cualquier hallazgo o desviación..." className="min-h-[80px] text-xs resize-none" /></FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
