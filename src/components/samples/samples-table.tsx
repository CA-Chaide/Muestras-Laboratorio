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
import { collection, query, where, CollectionReference, Query } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Sample } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import { EditSampleDialog } from './edit-sample-dialog';

interface SamplesTableProps {
  filters: {
    category: string;
    year: string;
    month: string;
  }
}

export function SamplesTable({ filters }: SamplesTableProps) {
  const { firestore, user } = useFirebase();

  const samplesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    
    let q: Query | CollectionReference = collection(firestore, 'users', user.uid, 'samples');
    
    const queryConstraints = [];

    if (filters.category && filters.category !== 'Todos') {
      queryConstraints.push(where('categoria', '==', filters.category));
    }

    const year = parseInt(filters.year, 10);
    const month = parseInt(filters.month, 10);

    if (!isNaN(year) && filters.year !== 'Todos') {
      let startDate, endDate;
      if (!isNaN(month) && filters.month !== 'Todos') {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      }
      queryConstraints.push(where('registrationDateTime', '>=', startDate.toISOString()));
      queryConstraints.push(where('registrationDateTime', '<=', endDate.toISOString()));
    } else if (!isNaN(month) && filters.month !== 'Todos' && (isNaN(year) || filters.year === 'Todos')) {
        const currentYear = new Date().getFullYear();
        let startDate = new Date(currentYear, month - 1, 1);
        let endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
        queryConstraints.push(where('registrationDateTime', '>=', startDate.toISOString()));
        queryConstraints.push(where('registrationDateTime', '<=', endDate.toISOString()));
    }

    if (queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }
    
    return q;
  }, [firestore, user, filters]);

  const { data: samples, isLoading, error } = useCollection<Sample>(samplesQuery);

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

  if (isLoading) {
    return (
       <Table>
        {tableHeader}
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-28" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-24 text-destructive">
            <p>Error al cargar las muestras. Es posible que falte un índice de Firestore. Revise la consola del desarrollador para obtener un enlace para crearlo.</p>
        </div>
    );
  }

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
              <EditSampleDialog sample={sample} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
