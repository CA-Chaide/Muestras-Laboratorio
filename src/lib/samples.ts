'use client';
import { collection, doc, Firestore } from "firebase/firestore";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { SampleFormValues } from "@/components/samples/sample-form";

export function saveSample(firestore: Firestore, userId: string, sampleData: SampleFormValues, categoria: string) {
    const samplesCollectionRef = collection(firestore, 'users', userId, 'samples');

    const registrationDateTime = new Date(sampleData.fechaIngreso);
    const [hours, minutes] = sampleData.horaIngreso.split(':');
    registrationDateTime.setHours(Number(hours), Number(minutes));

    const { fechaIngreso, horaIngreso, ...rest } = sampleData;

    const dataToSave = {
        ...rest,
        registrationDateTime: registrationDateTime.toISOString(),
        status: 'Registrado',
        userId: userId,
        categoria: categoria,
    };

    return addDocumentNonBlocking(samplesCollectionRef, dataToSave);
}

export function updateSample(firestore: Firestore, userId: string, sampleId: string, sampleData: SampleFormValues) {
    const sampleDocRef = doc(firestore, 'users', userId, 'samples', sampleId);

    const registrationDateTime = new Date(sampleData.fechaIngreso);
    const [hours, minutes] = sampleData.horaIngreso.split(':');
    registrationDateTime.setHours(Number(hours), Number(minutes));

    const { fechaIngreso, horaIngreso, ...rest } = sampleData;

    const dataToUpdate = {
        ...rest,
        registrationDateTime: registrationDateTime.toISOString(),
    };

    return updateDocumentNonBlocking(sampleDocRef, dataToUpdate);
}
