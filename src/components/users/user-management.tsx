'use client';

import { useState, useCallback } from 'react';
import { getUsers } from '@/lib/data';
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
import { UserFormDialog } from './user-form-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import type { UserProfile } from '@/lib/types';


export function UserManagement() {
    // TODO: Reemplazar con fetch a GET /api/users
    const [users, setUsers] = useState<UserProfile[]>(() => getUsers());

    const refreshUsers = useCallback(() => {
      // TODO: Reemplazar con fetch a GET /api/users
      setUsers(getUsers());
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Gestión de Técnicos</CardTitle>
                    <CardDescription>
                    Agrega, edita y gestiona los técnicos del laboratorio.
                    </CardDescription>
                </div>
                <UserFormDialog onSuccess={refreshUsers}>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Técnico
                    </Button>
                </UserFormDialog>
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
                    {users && users.length > 0 ? (
                        users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                            <Badge variant={user.role === 'Administrador' ? 'default' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <UserFormDialog user={user} onSuccess={refreshUsers}>
                                    <Button variant="ghost" size="icon">
                                        <FilePenLine className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                    </Button>
                                </UserFormDialog>
                                <DeleteUserDialog userId={user.id} userName={user.name} onSuccess={refreshUsers}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Eliminar</span>
                                    </Button>
                                </DeleteUserDialog>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No hay técnicos registrados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
      </Card>
    )
}
