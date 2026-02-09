import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function RecentTestsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre de la Prueba</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Asignado a</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center h-24">
            No hay pruebas recientes.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
