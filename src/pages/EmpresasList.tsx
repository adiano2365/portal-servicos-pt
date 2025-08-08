import Seo from "@/components/Seo";

const EmpresasList = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Empresas — PortalEmpresa" description="Descubra empresas e fornecedores em todo o país." canonical="/empresas" />
      <h1 className="text-3xl font-bold text-foreground">Empresas</h1>
      <p className="mt-2 text-muted-foreground">Catálogo público de empresas será exibido aqui.</p>
    </div>
  );
};

export default EmpresasList;
