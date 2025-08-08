import hero from "@/assets/hero-portalempresa.jpg";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <Seo
        title="PortalEmpresa — Conecte empresas e serviços em Portugal"
        description="Notícias, ofertas de emprego e divulgação de serviços. Publique e encontre fornecedores em minutos."
        canonical="/"
      />

      <section className="relative overflow-hidden">
        <div className="bg-gradient-hero/20 absolute inset-0" aria-hidden="true" />
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 py-16 md:py-24 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Conecte a sua empresa aos melhores provedores de serviços
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Notícias, ofertas de emprego e um marketplace para divulgar e contratar serviços em Portugal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/empresas"><Button size="lg" variant="hero">Procurar Empresas</Button></Link>
              <Link to="/auth/register"><Button size="lg" variant="accent">Publicar Anúncio</Button></Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Ilustração moderna de conexões de negócios em Portugal"
              loading="lazy"
              className="w-full rounded-xl shadow-elevated"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        <article className="rounded-lg border p-6 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Notícias em destaque</h2>
          <p className="text-muted-foreground mt-2">Atualizações do mercado e do ecossistema empresarial.</p>
          <Link to="/noticias" className="mt-4 inline-block text-primary underline-offset-4 hover:underline">Ver notícias</Link>
        </article>
        <article className="rounded-lg border p-6 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Ofertas de emprego</h2>
          <p className="text-muted-foreground mt-2">Descubra oportunidades ou publique vagas da sua empresa.</p>
          <Link to="/ofertas" className="mt-4 inline-block text-primary underline-offset-4 hover:underline">Ver ofertas</Link>
        </article>
        <article className="rounded-lg border p-6 bg-card">
          <h2 className="text-xl font-semibold text-foreground">Estatísticas em tempo real</h2>
          <p className="text-muted-foreground mt-2">Acompanhe visualizações, candidaturas e desempenho de anúncios.</p>
          <Link to="/empresa" className="mt-4 inline-block text-primary underline-offset-4 hover:underline">Aceder ao Dashboard</Link>
        </article>
      </section>
    </div>
  );
};

export default Index;
