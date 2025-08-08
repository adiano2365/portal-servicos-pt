import Seo from "@/components/Seo";

export default function EmpresasAdmin() {
  return (
    <section>
      <Seo title="Empresas — Admin" description="Gestão de empresas" canonical="/admin/empresas" />
      <h1 className="text-2xl font-semibold mb-4">Empresas</h1>
      <p className="text-muted-foreground">Em breve: aprovação, perfis e gestão.</p>
    </section>
  );
}
