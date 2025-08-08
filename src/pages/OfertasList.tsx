import Seo from "@/components/Seo";

const OfertasList = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Ofertas de Emprego — PortalEmpresa" description="Encontre oportunidades ou publique uma vaga." canonical="/ofertas" />
      <h1 className="text-3xl font-bold text-foreground">Ofertas de Emprego</h1>
      <p className="mt-2 text-muted-foreground">Em breve: filtro por localização e tipo de contrato.</p>
    </div>
  );
};

export default OfertasList;
