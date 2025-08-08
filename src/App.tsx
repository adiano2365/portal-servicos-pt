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
import AdminDashboard from "./pages/AdminDashboard";

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
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
