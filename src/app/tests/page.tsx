import { Header } from '@/components/layout/header';
import TestAnalysis from '@/components/tests/test-analysis';
import { tests } from '@/lib/data';

export default function TestsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Assigned Tests" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <TestAnalysis tests={tests} />
      </main>
    </div>
  );
}
