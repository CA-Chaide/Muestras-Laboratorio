'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SamplesTable } from '@/components/samples/samples-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const sampleCategories = [
  'Todos',
  'Espuma',
  'Tela',
  'Colchón',
  'Almohada',
  'Mueble',
  'Complemento',
  'Ensayos Espuma en Línea de Producción',
];

const years = ['Todos', '2024', '2023', '2022', '2021', '2020'];
const months = [
    { value: 'Todos', label: 'Todos' },
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];


export default function AllSamplesPage() {
  const [filters, setFilters] = useState({
    category: 'Todos',
    year: 'Todos',
    month: 'Todos',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Todas las Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Muestras Registradas</CardTitle>
            <CardDescription>
              Aquí puedes ver, filtrar y gestionar todas las muestras que han sido ingresadas al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="category-filter">Tipo de muestra</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger id="category-filter" className="w-auto min-w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year-filter">Año</Label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                  <SelectTrigger id="year-filter" className="w-[120px]">
                    <SelectValue placeholder="Filtrar por año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="month-filter">Mes</Label>
                <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                  <SelectTrigger id="month-filter" className="w-[150px]">
                    <SelectValue placeholder="Filtrar por mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SamplesTable filters={filters} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
