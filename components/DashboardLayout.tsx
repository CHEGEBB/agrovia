import { Sidebar } from '@/components/Sidebar';
import { MobileTopbar } from '@/components/MobileTopbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar: sticky on desktop, drawer on mobile */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar — hidden on md+ since sidebar header handles branding */}
        <MobileTopbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}