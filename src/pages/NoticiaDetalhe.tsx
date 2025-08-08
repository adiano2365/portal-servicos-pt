import { useParams } from "react-router-dom";
import Seo from "@/components/Seo";

const NoticiaDetalhe = () => {
  const { slug } = useParams();
  const title = slug ? `${slug.replace(/-/g, ' ')} — Notícias — PortalEmpresa` : 'Notícia — PortalEmpresa';
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title={title} description="Detalhe da notícia" canonical={`/noticias/${slug || ''}`} />
      <h1 className="text-3xl font-bold text-foreground">Notícia</h1>
      <p className="mt-2 text-muted-foreground">Conteúdo da notícia em breve.</p>
    </div>
  );
};

export default NoticiaDetalhe;
