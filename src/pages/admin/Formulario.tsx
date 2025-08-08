import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Seo from "@/components/Seo";

const schema = z.object({
  titulo: z.string().min(3, "Obrigatório"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  descricao: z.string().min(10, "Descreva melhor"),
  preco: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminFormulario() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { titulo: "", categoria: "", descricao: "" } });
  const { toast } = useToast();

  const onSubmit = (values: FormValues) => {
    toast({ title: "Submetido", description: "Formulário enviado com sucesso." });
    console.log(values);
  };

  return (
    <section className="max-w-3xl">
      <Seo title="Formulário — Admin" description="Formulário de gestão" canonical="/admin/formulario" />
      <Card>
        <CardHeader>
          <CardTitle>Formulário</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Nova vaga de designer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="noticia">Notícia</SelectItem>
                        <SelectItem value="anuncio">Anúncio</SelectItem>
                        <SelectItem value="vaga">Vaga</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Detalhe o conteúdo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="secondary" onClick={() => toast({ title: "Rascunho guardado" })}>
                  Guardar como rascunho
                </Button>
                <Button type="button" variant="outline" onClick={() => toast({ title: "Pré-visualização" })}>
                  Pré-visualizar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
