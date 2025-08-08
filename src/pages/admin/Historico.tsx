import Seo from "@/components/Seo";

export default function Historico() {
  return (
    <section>
      <Seo title="Histórico — Admin" description="Histórico de operações" canonical="/admin/historico" />
      <h1 className="text-2xl font-semibold mb-4">Histórico</h1>
      <p className="text-muted-foreground">Em breve: logs e auditoria.</p>
    </section>
  );
}
