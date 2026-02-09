import { Header } from '@/components/layout/header';
import { UserManagement } from '@/components/users/user-management';

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Panel de Control" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <UserManagement />
      </main>
    </div>
  );
}
