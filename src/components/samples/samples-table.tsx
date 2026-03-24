'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSamples } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import type { Sample } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditSampleDialog } from './edit-sample-dialog';

interface SamplesTableProps {
  filters: {
    category: string;
    year: string;
    month: string;
  }
}

export function SamplesTable({ filters }: SamplesTableProps) {
  // TODO: Reemplazar con fetch a GET /api/samples?...
  const [samples, setSamples] = useState<Sample[]>([]);

  const refreshSamples = useCallback(() => {
    setSamples(getSamples(filters));
  }, [filters]);

  useEffect(() => {
    refreshSamples();
  }, [refreshSamples]);

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead>Identificación</TableHead>
        <TableHead>Fecha y Hora Ingreso</TableHead>
        <TableHead>Descripción</TableHead>
        <TableHead>Fecha Fab./Lote</TableHead>
        <TableHead>Categoría</TableHead>
        <TableHead>Tipo de Muestra</TableHead>
        <TableHead>Ensayos Solicitados</TableHead>
        <TableHead>N° Solicitud</TableHead>
        <TableHead>N° Informe</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );

  if (!samples || samples.length === 0) {
    return (
      <Table>
        {tableHeader}
        <TableBody>
          <TableRow>
            <TableCell colSpan={11} className="text-center h-24">
              No hay muestras que coincidan con los filtros seleccionados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      {tableHeader}
      <TableBody>
        {samples.map((sample) => (
          <TableRow key={sample.id}>
            <TableCell className="font-medium">{sample.identificacion}</TableCell>
            <TableCell>{format(new Date(sample.registrationDateTime), 'PPpp', { locale: es })}</TableCell>
            <TableCell className="max-w-[200px] truncate" title={sample.descripcion}>{sample.descripcion}</TableCell>
            <TableCell>{sample.fechaFabricacionLote}</TableCell>
            <TableCell>{sample.categoria}</TableCell>
            <TableCell>{sample.tipoMuestra}</TableCell>
            <TableCell className="max-w-[200px] truncate" title={sample.ensayosSolicitados}>{sample.ensayosSolicitados}</TableCell>
            <TableCell>{sample.solicitudNumero}</TableCell>
            <TableCell>{sample.informeNumero}</TableCell>
            <TableCell>
              <Badge variant={sample.status === 'Registrado' ? 'default' : 'secondary'}>{sample.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <EditSampleDialog sample={sample} onSuccess={refreshSamples} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
