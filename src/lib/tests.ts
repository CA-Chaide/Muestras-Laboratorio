'use client';
import { collection, Firestore } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { Test } from "./types";

export type TestAssignmentData = {
  assignedTo: { id: string; name: string; };
  sample: { id: string; identificacion: string; };
  template: { id: string; name: string; };
};

export function assignTest(firestore: Firestore, userId: string, data: TestAssignmentData) {
    const testsCollectionRef = collection(firestore, 'tests');
    
    const dataToSave: Omit<Test, 'id'> = {
        sampleId: data.sample.id,
        sampleIdentificacion: data.sample.identificacion,
        assignedToId: data.assignedTo.id,
        assignedToName: data.assignedTo.name,
        assignedById: userId,
        templateId: data.template.id,
        templateName: data.template.name,
        assignedDate: new Date().toISOString(),
        status: 'Pendiente',
    };

    return addDocumentNonBlocking(testsCollectionRef, dataToSave);
}
