'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Test } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyTestsPage() {
  const { firestore, user } = useFirebase();

  const myTestsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'tests'),
      where('assignedToId', '==', user.uid),
      orderBy('assignedDate', 'desc')
    );
  }, [firestore, user]);

  const { data: tests, isLoading, error } = useCollection<Test>(myTestsQuery);

  const getStatusVariant = (status: Test['status']) => {
    switch (status) {
      case 'Pendiente': return 'secondary';
      case 'En Progreso': return 'default';
      case 'Completado': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Mis Ensayos Asignados" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Ensayos Pendientes</CardTitle>
            <CardDescription>
              Aquí encontrarás los ensayos que te han sido asignados para su ejecución.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Muestra</TableHead>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Fecha Asignación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : tests && tests.length > 0 ? (
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.sampleIdentificacion}</TableCell>
                      <TableCell>{test.templateName}</TableCell>
                      <TableCell>{format(new Date(test.assignedDate), 'PPpp', { locale: es })}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(test.status)}>{test.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm">
                          <Link href={`/essay-templates/${test.templateId}?testId=${test.id}`}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Realizar Ensayo
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No tienes ensayos asignados actualmente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}