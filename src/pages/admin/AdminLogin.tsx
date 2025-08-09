
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminLoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const { toast } = useToast();
  const form = useForm<AdminLoginForm>({
    defaultValues: { email: "", password: "" },
  });
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Se já estiver autenticado e for admin, redireciona
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id;
      if (!userId) return;
      // Verificar papel depois
      setTimeout(async () => {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (data) {
          const redirectTo = (location.state as any)?.from?.pathname || "/admin";
          navigate(redirectTo, { replace: true });
        }
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const userId = session?.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (data) {
        const redirectTo = (location.state as any)?.from?.pathname || "/admin";
        navigate(redirectTo, { replace: true });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [location.state, navigate]);

  const onSubmit = async (values: AdminLoginForm) => {
    setSubmitting(true);
    const email = values.email.trim();
    const password = values.password;

    if (isRegister) {
      // Registo
      const redirectUrl = `${window.location.origin}/admin/login`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      setSubmitting(false);
      if (error) {
        toast({ title: "Erro no registo", description: error.message });
        return;
      }
      toast({
        title: "Registo submetido",
        description:
          "Verifique o seu email para confirmar a conta. Depois, um administrador deve atribuir permissões de acesso.",
      });
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) {
        toast({ title: "Erro no login", description: error.message });
        return;
      }

      // Verificar papel admin
      const { data, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id || "")
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        toast({ title: "Erro ao verificar permissões", description: roleError.message });
        return;
      }

      if (!data) {
        toast({
          title: "Sem permissões de admin",
          description: "A sua conta não tem acesso ao painel de administração.",
        });
        navigate("/", { replace: true });
        return;
      }

      const redirectTo = (location.state as any)?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Seo title="Login Admin — PortalEmpresa" description="Acesso ao painel administrativo" canonical="/admin/login" />
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">
            {isRegister ? "Criar conta (Admin)" : "Acesso do Administrador"}
          </CardTitle>
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

              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? (isRegister ? "A registar..." : "A entrar...") : isRegister ? "Registar" : "Entrar"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {isRegister ? (
                  <>
                    Já tem conta?{" "}
                    <button
                      type="button"
                      className="text-primary underline"
                      onClick={() => setIsRegister(false)}
                    >
                      Iniciar sessão
                    </button>
                  </>
                ) : (
                  <>
                    Não tem conta?{" "}
                    <button
                      type="button"
                      className="text-primary underline"
                      onClick={() => setIsRegister(true)}
                    >
                      Criar conta
                    </button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
