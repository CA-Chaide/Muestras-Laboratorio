'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AssignedTestsTable } from '@/components/tests/assigned-tests-table';
import { AssignTestDialog } from '@/components/tests/assign-test-dialog';

export default function TestsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Pruebas Asignadas" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pruebas Asignadas</CardTitle>
              <CardDescription>
                Asigna muestras a técnicos y visualiza el estado de las pruebas.
              </CardDescription>
            </div>
            <AssignTestDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Asignar Prueba
              </Button>
            </AssignTestDialog>
          </CardHeader>
          <CardContent>
            <AssignedTestsTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
