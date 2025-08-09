
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SiteLayout from "@/components/layout/SiteLayout";
import NoticiasList from "./pages/NoticiasList";
import NoticiaDetalhe from "./pages/NoticiaDetalhe";
import OfertasList from "./pages/OfertasList";
import OfertaDetalhe from "./pages/OfertaDetalhe";
import EmpresasList from "./pages/EmpresasList";
import EmpresaPerfil from "./pages/EmpresaPerfil";
import Contato from "./pages/Contato";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/Dashboard";
import Funcionarios from "@/pages/admin/Funcionarios";
import Utilizadores from "@/pages/admin/Utilizadores";
import EmpresasAdmin from "@/pages/admin/Empresas";
import Consultores from "@/pages/admin/Consultores";
import VagasAdmin from "@/pages/admin/Vagas";
import Bolsas from "@/pages/admin/Bolsas";
import Subscricoes from "@/pages/admin/Subscricoes";
import Consultorias from "@/pages/admin/Consultorias";
import Historico from "@/pages/admin/Historico";
import Pagamentos from "@/pages/admin/Pagamentos";
import AdminFormulario from "@/pages/admin/Formulario";
import AdminEmail from "@/pages/admin/Email";
import PublicConfigurations from "@/pages/admin/PublicConfigurations";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<Index />} />
            <Route path="noticias" element={<NoticiasList />} />
            <Route path="noticias/:slug" element={<NoticiaDetalhe />} />
            <Route path="ofertas" element={<OfertasList />} />
            <Route path="ofertas/:id" element={<OfertaDetalhe />} />
            <Route path="empresas" element={<EmpresasList />} />
            <Route path="empresas/:slug" element={<EmpresaPerfil />} />
            <Route path="contato" element={<Contato />} />
            <Route path="auth/login" element={<AuthLogin />} />
            <Route path="auth/register" element={<AuthRegister />} />
            <Route path="empresa" element={<EmpresaDashboard />} />
          </Route>

          {/* Área de Admin protegida por papel "admin" */}
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="utilizadores" element={<Utilizadores />} />
            <Route path="empresas" element={<EmpresasAdmin />} />
            <Route path="consultores" element={<Consultores />} />
            <Route path="vagas" element={<VagasAdmin />} />
            <Route path="bolsas" element={<Bolsas />} />
            <Route path="subscricoes" element={<Subscricoes />} />
            <Route path="consultorias" element={<Consultorias />} />
            <Route path="historico" element={<Historico />} />
            <Route path="pagamentos" element={<Pagamentos />} />
            <Route path="email" element={<AdminEmail />} />
            <Route path="public-configurations" element={<PublicConfigurations />} />
            <Route path="formulario" element={<AdminFormulario />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
