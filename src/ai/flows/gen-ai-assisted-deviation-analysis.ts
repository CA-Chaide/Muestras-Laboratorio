'use server';
/**
 * @fileOverview Este archivo define un flujo de Genkit para el análisis de desviaciones asistido por IA en los resultados de pruebas de laboratorio.
 *
 * - analyzeDeviation - Analiza posibles desviaciones en los resultados de las pruebas usando GenAI.
 * - DeviationAnalysisInput - El tipo de entrada para la función analyzeDeviation.
 * - DeviationAnalysisOutput - El tipo de retorno para la función analyzeDeviation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeviationAnalysisInputSchema = z.object({
  testName: z.string().describe('El nombre de la prueba realizada.'),
  testResult: z.string().describe('El resultado obtenido de la prueba.'),
  expectedValue: z.string().describe('El valor esperado para la prueba.'),
});
export type DeviationAnalysisInput = z.infer<typeof DeviationAnalysisInputSchema>;

const DeviationAnalysisOutputSchema = z.object({
  deviationDetected: z.boolean().describe('Si se detecta una desviación del valor esperado.'),
  referenceInformation: z.string().describe('Información relevante extraída de fuentes en línea.'),
  sourceLink: z.string().describe('El enlace a la fuente de la información de referencia.'),
});
export type DeviationAnalysisOutput = z.infer<typeof DeviationAnalysisOutputSchema>;

const extractReferenceInformation = ai.defineTool({
  name: 'extractReferenceInformation',
  description: 'Extrae información de referencia relevante de fuentes en línea sobre una prueba específica y sus valores esperados, proporcionando un enlace de origen.',
  inputSchema: z.object({
    testName: z.string().describe('El nombre de la prueba.'),
    expectedValue: z.string().describe('El valor esperado para la prueba.'),
  }),
  outputSchema: z.object({
    information: z.string().describe('La información de referencia extraída.'),
    sourceUrl: z.string().describe('La URL de la fuente.'),
  }),
},
async (input) => {
    // Implementación de marcador de posición: en una aplicación real, esto usaría una API externa o web scraping para obtener información.
    // Por ahora, devuelve una respuesta predefinida.
    return {
      information: `Información de referencia para ${input.testName} con valor esperado ${input.expectedValue} extraída de una fuente de muestra.`, // Reemplazar con información extraída real
      sourceUrl: 'https://example.com/reference',
    };
  }
);

const analyzeDeviationPrompt = ai.definePrompt({
  name: 'analyzeDeviationPrompt',
  input: {schema: DeviationAnalysisInputSchema},
  output: {schema: DeviationAnalysisOutputSchema},
  tools: [extractReferenceInformation],
  prompt: `Eres un asistente experto de técnico de laboratorio. Dado un resultado de prueba y su valor esperado, determina si hay una desviación. Si se sospecha una desviación, usa la herramienta extractReferenceInformation para recopilar contexto de apoyo de fuentes en línea confiables.

Nombre de la Prueba: {{{testName}}}
Resultado de la Prueba: {{{testResult}}}
Valor Esperado: {{{expectedValue}}}

Basado en el resultado de la prueba y el valor esperado, ¿hay una desviación? Si es así, usa la herramienta extractReferenceInformation para encontrar más información.
`, // Actualizado para usar la herramienta para la extracción de información
  system: `Estás ayudando en el análisis de los resultados de las pruebas de laboratorio. Si el resultado de la prueba se desvía significativamente del valor esperado, usa la herramienta extractReferenceInformation para proporcionar contexto y un enlace de origen.`, // Se agregó un prompt del sistema
});

export async function analyzeDeviation(input: DeviationAnalysisInput): Promise<DeviationAnalysisOutput> {
  return analyzeDeviationFlow(input);
}

const analyzeDeviationFlow = ai.defineFlow(
  {
    name: 'analyzeDeviationFlow',
    inputSchema: DeviationAnalysisInputSchema,
    outputSchema: DeviationAnalysisOutputSchema,
  },
  async input => {
    const deviationPromptResult = await analyzeDeviationPrompt(input);
    const deviationDetected = input.testResult !== input.expectedValue; // Lógica simple de detección de desviación

    let referenceInformation = '';
    let sourceLink = '';

    if (deviationDetected) {
      const toolResult = await extractReferenceInformation({
        testName: input.testName,
        expectedValue: input.expectedValue,
      });
      referenceInformation = toolResult.information;
      sourceLink = toolResult.sourceUrl;
    }

    return {
      deviationDetected: deviationDetected,
      referenceInformation: referenceInformation,
      sourceLink: sourceLink,
    };
  }
);
