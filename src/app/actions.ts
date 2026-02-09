'use server';

import {
  analyzeDeviation,
  type DeviationAnalysisInput,
} from '@/ai/flows/gen-ai-assisted-deviation-analysis';

export async function getDeviationAnalysis(input: DeviationAnalysisInput) {
  try {
    // Add a delay to simulate network latency for a better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = await analyzeDeviation(input);
    return result;
  } catch (error) {
    console.error('Error in getDeviationAnalysis:', error);
    return { error: 'An unexpected error occurred while analyzing the deviation.' };
  }
}
