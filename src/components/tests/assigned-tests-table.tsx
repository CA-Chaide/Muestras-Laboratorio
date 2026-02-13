'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Test } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

export function AssignedTestsTable() {
  const { firestore } = useFirebase();

  const testsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'tests'), orderBy('assignedDate', 'desc'));
  }, [firestore]);

  const { data: tests, isLoading, error } = useCollection<Test>(testsQuery);

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

  if (isLoading) {
    return (
      <Table>
        {tableHeader}
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-24 text-destructive">
        <p>Error al cargar las pruebas. Es posible que falte un índice de Firestore. Revise la consola para más detalles.</p>
      </div>
    );
  }

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
