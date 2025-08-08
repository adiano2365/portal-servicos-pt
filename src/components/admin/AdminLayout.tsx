import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Seo from "@/components/Seo";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <Seo
        title="Admin — PortalEmpresa"
        description="Painel administrativo, gestão e métricas"
        canonical="/admin"
      />
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center gap-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="" />
            <div className="flex-1">
              <input
                type="search"
                placeholder="Pesquisar..."
                className="w-full max-w-xl h-10 rounded-md border bg-muted/40 px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                aria-label="Pesquisar no painel"
              />
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
