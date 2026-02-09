import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SampleStatusChart } from '@/components/dashboard/sample-status-chart';
import { RecentTestsTable } from '@/components/dashboard/recent-tests-table';
import { FileText, FlaskConical, Beaker, CheckCircle, Clock } from 'lucide-react';
import { tests } from '@/lib/data';

export default function DashboardPage() {
  const completedTests = tests.filter(t => t.status === 'Completed').length;
  const pendingTests = tests.filter(t => t.status !== 'Completed').length;
  
  return (
    <div className="flex flex-col w-full">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Samples"
            value="1,254"
            icon={Beaker}
            description="+20.1% from last month"
          />
          <StatsCard
            title="Tests Completed"
            value={completedTests.toString()}
            icon={CheckCircle}
            description="All completed analyses"
          />
          <StatsCard
            title="Pending Tests"
            value={pendingTests.toString()}
            icon={Clock}
            description="Tests currently in progress"
          />
          <StatsCard
            title="Reports Generated"
            value="312"
            icon={FileText}
            description="Total reports issued"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Sample Status Overview</CardTitle>
              <CardDescription>
                A visual representation of sample statuses in the lab.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SampleStatusChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>
                An overview of the most recently assigned tests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTestsTable tests={tests.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
