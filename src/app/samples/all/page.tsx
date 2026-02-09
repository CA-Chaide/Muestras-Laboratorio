import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SamplesTable } from '@/components/samples/samples-table';

export default function AllSamplesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Todas las Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Muestras Registradas</CardTitle>
            <CardDescription>
              Aquí puedes ver y gestionar todas las muestras que han sido ingresadas al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SamplesTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
