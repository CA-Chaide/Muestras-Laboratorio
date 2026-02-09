'use client';
import { collection, Firestore } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { SampleFormValues } from "@/components/samples/sample-form";

export function saveSample(firestore: Firestore, userId: string, sampleData: SampleFormValues) {
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
    };

    return addDocumentNonBlocking(samplesCollectionRef, dataToSave);
}
