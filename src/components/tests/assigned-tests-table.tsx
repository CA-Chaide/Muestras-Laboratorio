'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getTests } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import type { Test } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AssignedTestsTable() {
  // TODO: Reemplazar con fetch a GET /api/tests
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    setTests(getTests());
  }, []);

  const getStatusVariant = (status: Test['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'secondary';
      case 'En Progreso':
        return 'default';
      case 'Completado':
        return 'outline'; // This should be a success-like color. We can add a variant.
      default:
        return 'secondary';
    }
  };

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead>Muestra</TableHead>
        <TableHead>Plantilla de Ensayo</TableHead>
        <TableHead>Técnico Asignado</TableHead>
        <TableHead>Fecha de Asignación</TableHead>
        <TableHead>Estado</TableHead>
      </TableRow>
    </TableHeader>
  );

  if (!tests || tests.length === 0) {
    return (
      <Table>
        {tableHeader}
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              No hay pruebas asignadas.
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
        {tests.map((test) => (
          <TableRow key={test.id}>
            <TableCell className="font-medium">{test.sampleIdentificacion}</TableCell>
            <TableCell>{test.templateName}</TableCell>
            <TableCell>{test.assignedToName}</TableCell>
            <TableCell>{format(new Date(test.assignedDate), 'PPpp', { locale: es })}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(test.status)}>{test.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
