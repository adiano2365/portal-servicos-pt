import Seo from "@/components/Seo";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Admin — PortalEmpresa" description="Métricas, gestão e aprovação de conteúdos" canonical="/admin" />
      <h1 className="text-3xl font-bold text-foreground">Administração</h1>
      <p className="mt-2 text-muted-foreground">Em breve: métricas gerais, gestão de conteúdos e assinaturas.</p>
    </div>
  );
};

export default AdminDashboard;
