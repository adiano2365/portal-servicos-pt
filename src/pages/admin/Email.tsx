import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Seo from "@/components/Seo";
import { useToast } from "@/hooks/use-toast";

export default function AdminEmail() {
  const { toast } = useToast();

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Email de teste enviado", description: "(Simulação) Verifique a caixa de entrada." });
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Configurações guardadas", description: "(Simulação) SMTP atualizado." });
  };

  return (
    <section className="space-y-6">
      <Seo title="Gestão de Email — Admin" description="Configurar SMTP e enviar emails de teste" canonical="/admin/email" />
      <h1 className="text-3xl font-bold">Gestão de Email</h1>
      <p className="text-muted-foreground">Configure o SMTP e valide entregabilidade com um envio de teste.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enviar Email de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleTest}>
              <div className="space-y-2">
                <Label htmlFor="to">Destinatário</Label>
                <Input id="to" type="email" placeholder="email@dominio.pt" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Teste de entrega" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Mensagem</Label>
                <Textarea id="body" placeholder="Olá, este é um email de teste." rows={6} />
              </div>
              <Button type="submit">Enviar teste</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações SMTP</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSaveSmtp}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input id="host" placeholder="smtp.seuprovedor.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Porta</Label>
                  <Input id="port" type="number" placeholder="587" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">Utilizador</Label>
                  <Input id="user" placeholder="no-reply@dominio.pt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">Senha</Label>
                  <Input id="pass" type="password" placeholder="••••••••" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="secondary" onClick={() => toast({ title: "Conexão testada", description: "(Simulação) Ligação SMTP válida." })}>
                  Testar ligação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
