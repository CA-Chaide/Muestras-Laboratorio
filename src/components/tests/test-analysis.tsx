'use client';

import { useState } from 'react';
import type { Test } from '@/lib/types';
import { getDeviationAnalysis } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert, FileText, Link as LinkIcon, Loader, FlaskConical, User, Calendar, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeviationAnalysisOutput } from '@/ai/flows/gen-ai-assisted-deviation-analysis';

type AnalysisResult = DeviationAnalysisOutput & { error?: string };

export default function TestAnalysis({ tests }: { tests: Test[] }) {
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult | null>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleAnalysis = async (test: Test) => {
    setLoadingStates((prev) => ({ ...prev, [test.id]: true }));
    const result = await getDeviationAnalysis({
      testName: test.name,
      testResult: test.result,
      expectedValue: test.expectedValue,
    });
    setAnalysisResults((prev) => ({ ...prev, [test.id]: result }));
    setLoadingStates((prev) => ({ ...prev, [test.id]: false }));
  };
  
  const getStatusVariant = (status: Test['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Requires Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {tests.map((test) => {
        const result = analysisResults[test.id];
        const isLoading = loadingStates[test.id];

        return (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <Badge variant="outline" className={cn('border-0 font-normal', getStatusVariant(test.status))}>
                      {test.status}
                  </Badge>
              </div>
              <CardDescription>Sample ID: {test.sampleId}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><User className="size-4 text-muted-foreground" /> <strong>Assigned To:</strong> {test.assignedTo}</div>
                <div className="flex items-center gap-2"><Calendar className="size-4 text-muted-foreground" /> <strong>Due Date:</strong> {test.dueDate}</div>
                <div className="flex items-center gap-2"><FlaskConical className="size-4 text-muted-foreground" /> <strong>Expected:</strong> <code className="bg-muted px-2 py-1 rounded-md">{test.expectedValue}</code></div>
                <div className="flex items-center gap-2"><ClipboardCheck className="size-4 text-muted-foreground" /> <strong>Result:</strong> <code className="bg-muted px-2 py-1 rounded-md">{test.result}</code></div>
              </div>

              {isLoading && (
                 <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                 </div>
              )}
              {result && !isLoading && (
                <div className="pt-4">
                  {result.error ? (
                    <Alert variant="destructive">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Analysis Error</AlertTitle>
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  ) : result.deviationDetected ? (
                    <Alert variant="destructive">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Potential Deviation Detected</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">{result.referenceInformation}</p>
                        <a href={result.sourceLink} target="_blank" rel="noopener noreferrer" className="text-destructive-foreground underline font-medium flex items-center gap-1">
                           <LinkIcon className="size-3" /> Source
                        </a>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertTitle>No Deviation Detected</AlertTitle>
                        <AlertDescription>
                            The test result is within the expected range. No further action is required.
                        </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleAnalysis(test)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin spinner" />}
                {isLoading ? 'Analyzing...' : result ? 'Re-analyze Deviation' : 'Analyze Deviation'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
