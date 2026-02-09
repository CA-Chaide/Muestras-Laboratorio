'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FilePenLine, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Placeholder data for technicians
const technicians = [
    { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Técnico' },
    { id: '2', name: 'Ana Gómez', email: 'ana.gomez@example.com', role: 'Técnico' },
    { id: '3', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', role: 'Administrador' },
];

export function UserManagement() {
    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Gestión de Técnicos</CardTitle>
              <CardDescription>
              Agrega, edita y gestiona los técnicos del laboratorio.
              </CardDescription>
          </div>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Técnico
          </Button>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {technicians.map((tech) => (
                <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>{tech.email}</TableCell>
                    <TableCell>
                    <Badge variant={tech.role === 'Administrador' ? 'default' : 'secondary'}>{tech.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                        <FilePenLine className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    )
}
