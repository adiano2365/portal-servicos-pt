import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const { toast } = useToast();
  const form = useForm<AdminLoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: AdminLoginForm) => {
    // Aqui poderemos integrar com Supabase Auth futuramente
    toast({ title: "Login submetido", description: `Utilizador: ${values.email}` });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Seo title="Login Admin — PortalEmpresa" description="Acesso ao painel administrativo" canonical="/admin/login" />
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">Acesso do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@dominio.pt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Senha é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">Entrar</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
