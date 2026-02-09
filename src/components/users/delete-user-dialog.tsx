'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
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
}

export function DeleteUserDialog({ userId, userName, children }: DeleteUserDialogProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!firestore) return;
    setIsDeleting(true);

    try {
      await deleteUser(firestore, userId);
      toast({ title: 'Técnico eliminado', description: `${userName} ha sido eliminado del sistema.` });
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
