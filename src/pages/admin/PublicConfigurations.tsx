import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Seo from "@/components/Seo";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PublicConfigurations() {
  const { toast } = useToast();
  const [state, setState] = useState({
    siteAtivo: true,
    mostrarEstatisticas: true,
    buscaPublica: true,
    modoManutencao: false,
  });

  const save = () => {
    toast({ title: "Configurações guardadas", description: "(Simulação) Preferências públicas atualizadas." });
  };

  return (
    <section className="space-y-6">
      <Seo title="Public Configurations — Admin" description="Definições públicas do site" canonical="/admin/public-configurations" />
      <h1 className="text-3xl font-bold">Public Configurations</h1>
      <p className="text-muted-foreground">Ative/desative funcionalidades visíveis para os visitantes.</p>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Site ativo</Label>
              <p className="text-sm text-muted-foreground">Desative para colocar o site offline.</p>
            </div>
            <Switch checked={state.siteAtivo} onCheckedChange={(v) => setState((s) => ({ ...s, siteAtivo: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar estatísticas</Label>
              <p className="text-sm text-muted-foreground">Exibe contadores e métricas na homepage.</p>
            </div>
            <Switch checked={state.mostrarEstatisticas} onCheckedChange={(v) => setState((s) => ({ ...s, mostrarEstatisticas: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Busca pública</Label>
              <p className="text-sm text-muted-foreground">Permite pesquisa de empresas/serviços.</p>
            </div>
            <Switch checked={state.buscaPublica} onCheckedChange={(v) => setState((s) => ({ ...s, buscaPublica: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Modo manutenção</Label>
              <p className="text-sm text-muted-foreground">Mostra aviso de manutenção aos visitantes.</p>
            </div>
            <Switch checked={state.modoManutencao} onCheckedChange={(v) => setState((s) => ({ ...s, modoManutencao: v }))} />
          </div>
          <div className="pt-2">
            <Button onClick={save}>Guardar</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
