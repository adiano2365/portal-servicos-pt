import Seo from "@/components/Seo";

const NoticiasList = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Notícias — PortalEmpresa" description="Acompanhe as últimas notícias do ecossistema empresarial." canonical="/noticias" />
      <h1 className="text-3xl font-bold text-foreground">Notícias</h1>
      <p className="mt-2 text-muted-foreground">Em breve: lista de notícias com paginação e categorias.</p>
    </div>
  );
};

export default NoticiasList;
