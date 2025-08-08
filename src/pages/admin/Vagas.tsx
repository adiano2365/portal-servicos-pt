import Seo from "@/components/Seo";

export default function VagasAdmin() {
  return (
    <section>
      <Seo title="Vagas — Admin" description="Gestão de vagas" canonical="/admin/vagas" />
      <h1 className="text-2xl font-semibold mb-4">Vagas</h1>
      <p className="text-muted-foreground">Em breve: aprovação e gestão de vagas.</p>
    </section>
  );
}
