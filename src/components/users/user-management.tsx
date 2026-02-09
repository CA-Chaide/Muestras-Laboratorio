'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
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
import { Skeleton } from '@/components/ui/skeleton';
import { UserFormDialog } from './user-form-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import type { UserProfile } from '@/lib/types';


export function UserManagement() {
    const { firestore } = useFirebase();

    const usersCollection = useMemoFirebase(
        () => (firestore ? collection(firestore, 'users') : null),
        [firestore]
    );
    const { data: users, isLoading } = useCollection<UserProfile>(usersCollection);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Gestión de Técnicos</CardTitle>
                    <CardDescription>
                    Agrega, edita y gestiona los técnicos del laboratorio.
                    </CardDescription>
                </div>
                <UserFormDialog>
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
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                            </TableRow>
                        ))
                    ) : users && users.length > 0 ? (
                        users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                            <Badge variant={user.role === 'Administrador' ? 'default' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <UserFormDialog user={user}>
                                    <Button variant="ghost" size="icon">
                                        <FilePenLine className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                    </Button>
                                </UserFormDialog>
                                <DeleteUserDialog userId={user.id} userName={user.name}>
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
