import { useParams } from "react-router-dom";
import Seo from "@/components/Seo";

const EmpresaPerfil = () => {
  const { slug } = useParams();
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title={`Empresa ${slug || ''} — PortalEmpresa`} description="Perfil público da empresa" canonical={`/empresas/${slug || ''}`} />
      <h1 className="text-3xl font-bold text-foreground">Perfil da Empresa</h1>
      <p className="mt-2 text-muted-foreground">Apresentação, contactos, serviços e anúncios.</p>
    </div>
  );
};

export default EmpresaPerfil;
