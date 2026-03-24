'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteUser } from '@/lib/users';

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function DeleteUserDialog({ userId, userName, children, onSuccess }: DeleteUserDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // TODO: Reemplazar con llamada a DELETE /api/users/:id
      await deleteUser(userId);
      toast({ title: 'Técnico eliminado', description: `${userName} ha sido eliminado del sistema.` });
      onSuccess?.();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: e.message,
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente al técnico{' '}
            <strong>{userName}</strong> del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
