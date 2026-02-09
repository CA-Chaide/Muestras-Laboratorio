import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Test } from '@/lib/types';
import { cn } from '@/lib/utils';

export function RecentTestsTable({ tests }: { tests: Test[] }) {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tests.map((test) => (
          <TableRow key={test.id}>
            <TableCell className="font-medium">{test.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn('border-0 font-normal', getStatusVariant(test.status))}>
                {test.status}
              </Badge>
            </TableCell>
            <TableCell>{test.assignedTo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
