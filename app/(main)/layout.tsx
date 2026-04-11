import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
