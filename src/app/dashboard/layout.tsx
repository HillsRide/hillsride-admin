import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950">
      <Header />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}