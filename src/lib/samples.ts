'use client';
import { collection, doc, Firestore, getDocs, query, where } from "firebase/firestore";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { SampleFormValues } from "@/components/samples/sample-form";

export async function saveSample(firestore: Firestore, userId: string, sampleData: SampleFormValues, categoria: string) {
    const samplesCollectionRef = collection(firestore, 'users', userId, 'samples');

    const q = query(samplesCollectionRef, where("identificacion", "==", sampleData.identificacion));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error(`Ya existe una muestra con la identificación '${sampleData.identificacion}'.`);
    }

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

export async function updateSample(firestore: Firestore, userId: string, sampleId: string, sampleData: SampleFormValues) {
    const sampleDocRef = doc(firestore, 'users', userId, 'samples', sampleId);
    const samplesCollectionRef = collection(firestore, 'users', userId, 'samples');

    const q = query(samplesCollectionRef, where("identificacion", "==", sampleData.identificacion));
    const querySnapshot = await getDocs(q);

    const otherDocs = querySnapshot.docs.filter(doc => doc.id !== sampleId);

    if (otherDocs.length > 0) {
      throw new Error(`Ya existe otra muestra con la identificación '${sampleData.identificacion}'.`);
    }


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
