'use client';
import { collection, doc, Firestore } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export type UserData = {
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico';
}

export function addUser(firestore: Firestore, userData: UserData) {
    const usersCollectionRef = collection(firestore, 'users');
    return addDocumentNonBlocking(usersCollectionRef, userData);
}

export function updateUser(firestore: Firestore, userId: string, userData: Partial<UserData>) {
    const userDocRef = doc(firestore, 'users', userId);
    return updateDocumentNonBlocking(userDocRef, userData);
}

export function deleteUser(firestore: Firestore, userId: string) {
    const userDocRef = doc(firestore, 'users', userId);
    return deleteDocumentNonBlocking(userDocRef);
}
