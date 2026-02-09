import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function SamplesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Identificación</TableHead>
          <TableHead>Fecha de Ingreso</TableHead>
          <TableHead>Tipo de Muestra</TableHead>
          <TableHead>N° Solicitud</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
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
