import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Document Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Document Management Coming Soon</h3>
              <p className="text-muted-foreground">This module for managing SOPs, records, and materials is under construction.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
