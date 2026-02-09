import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Report Generation" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
              <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Report Generation Coming Soon</h3>
              <p className="text-muted-foreground">This module for generating and viewing test reports is under construction.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
