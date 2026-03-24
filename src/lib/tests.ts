/**
 * Servicio de Tests / Ensayos
 * TODO: Reemplazar funciones con llamadas a API REST
 */
import type { Test } from "./types";
import { tests, generateId } from "./data";

export type TestAssignmentData = {
  assignedTo: { id: string; name: string; };
  sample: { id: string; identificacion: string; };
  template: { id: string; name: string; };
};

/**
 * Asigna un nuevo test/ensayo.
 * TODO: Reemplazar con POST /api/tests
 */
export async function assignTest(userId: string, data: TestAssignmentData): Promise<Test> {
    const newTest: Test = {
        id: generateId(),
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

    tests.push(newTest);
    return newTest;
}
