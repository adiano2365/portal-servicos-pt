import Seo from "@/components/Seo";

const EmpresaDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Dashboard da Empresa — PortalEmpresa" description="Gestão de anúncios, vagas e assinatura" canonical="/empresa" />
      <h1 className="text-3xl font-bold text-foreground">Dashboard da Empresa</h1>
      <p className="mt-2 text-muted-foreground">Em breve: estatísticas em tempo real, gestão de perfil, anúncios e vagas.</p>
    </div>
  );
};

export default EmpresaDashboard;
