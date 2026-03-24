'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCurrentUser, getTestsByUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import type { Test } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyTestsPage() {
  // TODO: Reemplazar mockCurrentUser con usuario autenticado desde la API
  const user = mockCurrentUser;

  // TODO: Reemplazar con fetch a GET /api/tests?assignedToId=...
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    setTests(getTestsByUser(user.uid));
  }, [user.uid]);

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
                {tests && tests.length > 0 ? (
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