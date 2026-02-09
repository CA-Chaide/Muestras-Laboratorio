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
import { collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Sample } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

export function SamplesTable() {
  const { firestore, user } = useFirebase();

  const samplesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'samples');
  }, [firestore, user]);

  const { data: samples, isLoading, error } = useCollection<Sample>(samplesQuery);

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead>Identificación</TableHead>
        <TableHead>Fecha de Ingreso</TableHead>
        <TableHead>Tipo de Muestra</TableHead>
        <TableHead>N° Solicitud</TableHead>
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
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
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
            <p>Error al cargar las muestras: {error.message}</p>
        </div>
    );
  }

  if (!samples || samples.length === 0) {
    return (
      <Table>
        {tableHeader}
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              No hay muestras registradas.
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
            <TableCell>{sample.tipoMuestra}</TableCell>
            <TableCell>{sample.solicitudNumero}</TableCell>
            <TableCell>
              <Badge variant={sample.status === 'Registrado' ? 'default' : 'secondary'}>{sample.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
