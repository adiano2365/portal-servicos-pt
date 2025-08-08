import { useParams } from "react-router-dom";
import Seo from "@/components/Seo";

const OfertaDetalhe = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title={`Oferta #${id} — PortalEmpresa`} description="Detalhe da oferta de emprego" canonical={`/ofertas/${id || ''}`} />
      <h1 className="text-3xl font-bold text-foreground">Detalhe da Oferta</h1>
      <p className="mt-2 text-muted-foreground">Descrição da vaga, requisitos e como candidatar-se.</p>
    </div>
  );
};

export default OfertaDetalhe;
