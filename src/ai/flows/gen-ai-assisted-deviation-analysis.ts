'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-assisted deviation analysis in lab test results.
 *
 * - analyzeDeviation - Analyzes potential deviations in test results using GenAI.
 * - DeviationAnalysisInput - The input type for the analyzeDeviation function.
 * - DeviationAnalysisOutput - The return type for the analyzeDeviation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeviationAnalysisInputSchema = z.object({
  testName: z.string().describe('The name of the test performed.'),
  testResult: z.string().describe('The result obtained from the test.'),
  expectedValue: z.string().describe('The expected value for the test.'),
});
export type DeviationAnalysisInput = z.infer<typeof DeviationAnalysisInputSchema>;

const DeviationAnalysisOutputSchema = z.object({
  deviationDetected: z.boolean().describe('Whether a deviation from the expected value is detected.'),
  referenceInformation: z.string().describe('Relevant information extracted from online sources.'),
  sourceLink: z.string().describe('The link to the source of the reference information.'),
});
export type DeviationAnalysisOutput = z.infer<typeof DeviationAnalysisOutputSchema>;

const extractReferenceInformation = ai.defineTool({
  name: 'extractReferenceInformation',
  description: 'Extracts relevant reference information from online sources about a specific test and its expected values, providing a source link.',
  inputSchema: z.object({
    testName: z.string().describe('The name of the test.'),
    expectedValue: z.string().describe('The expected value for the test.'),
  }),
  outputSchema: z.object({
    information: z.string().describe('The extracted reference information.'),
    sourceUrl: z.string().describe('The URL of the source.'),
  }),
},
async (input) => {
    // Placeholder implementation:  In a real application, this would use an external API or web scraping to fetch information.
    // For now, return a canned response.
    return {
      information: `Reference information for ${input.testName} with expected value ${input.expectedValue} extracted from a sample source.`, // Replace with actual extracted info
      sourceUrl: 'https://example.com/reference',
    };
  }
);

const analyzeDeviationPrompt = ai.definePrompt({
  name: 'analyzeDeviationPrompt',
  input: {schema: DeviationAnalysisInputSchema},
  output: {schema: DeviationAnalysisOutputSchema},
  tools: [extractReferenceInformation],
  prompt: `You are an expert lab technician assistant. Given a test result and its expected value, determine if there's a deviation. If a deviation is suspected, use the extractReferenceInformation tool to gather supporting context from reliable online sources.

Test Name: {{{testName}}}
Test Result: {{{testResult}}}
Expected Value: {{{expectedValue}}}

Based on the test result and expected value, is there a deviation?  If so, use the extractReferenceInformation tool to find more information.
`, // Updated to use tool for information extraction
  system: `You are assisting in the analysis of lab test results. If the test result deviates significantly from the expected value, use the extractReferenceInformation tool to provide context and a source link.`, // Added system prompt
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
    const deviationDetected = input.testResult !== input.expectedValue; // Simple deviation detection logic

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
