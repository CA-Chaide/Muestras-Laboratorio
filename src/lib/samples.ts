/**
 * Servicio de Muestras
 * TODO: Reemplazar funciones con llamadas a API REST
 */
import type { SampleFormValues } from "@/components/samples/sample-form";
import type { Sample } from "./types";
import { samples, generateId } from "./data";

/**
 * Guarda una nueva muestra en el almacén de datos.
 * TODO: Reemplazar con POST /api/samples
 */
export async function saveSample(userId: string, sampleData: SampleFormValues, categoria: string): Promise<Sample> {
    const existing = samples.find(
      s => s.identificacion === sampleData.identificacion && s.userId === userId
    );
    if (existing) {
      throw new Error(`Ya existe una muestra con la identificación '${sampleData.identificacion}'.`);
    }

    const registrationDateTime = new Date(sampleData.fechaIngreso);
    const [hours, minutes] = sampleData.horaIngreso.split(':');
    registrationDateTime.setHours(Number(hours), Number(minutes));

    const { fechaIngreso, horaIngreso, ...rest } = sampleData;

    const newSample: Sample = {
        id: generateId(),
        ...rest,
        registrationDateTime: registrationDateTime.toISOString(),
        status: 'Registrado',
        userId: userId,
        categoria: categoria,
    };

    samples.push(newSample);
    return newSample;
}

/**
 * Actualiza una muestra existente.
 * TODO: Reemplazar con PUT /api/samples/:sampleId
 */
export async function updateSample(userId: string, sampleId: string, sampleData: SampleFormValues): Promise<Sample> {
    const sampleIndex = samples.findIndex(s => s.id === sampleId);
    if (sampleIndex === -1) throw new Error('Muestra no encontrada.');

    const duplicate = samples.find(
      s => s.identificacion === sampleData.identificacion && s.id !== sampleId && s.userId === userId
    );
    if (duplicate) {
      throw new Error(`Ya existe otra muestra con la identificación '${sampleData.identificacion}'.`);
    }

    const registrationDateTime = new Date(sampleData.fechaIngreso);
    const [hours, minutes] = sampleData.horaIngreso.split(':');
    registrationDateTime.setHours(Number(hours), Number(minutes));

    const { fechaIngreso, horaIngreso, ...rest } = sampleData;

    samples[sampleIndex] = {
        ...samples[sampleIndex],
        ...rest,
        registrationDateTime: registrationDateTime.toISOString(),
    };

    return samples[sampleIndex];
}
