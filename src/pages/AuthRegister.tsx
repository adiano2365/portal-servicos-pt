import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const AuthRegister = () => {
  const onSubmit = (e: React.FormEvent) => e.preventDefault();
  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Seo title="Registar — PortalEmpresa" description="Crie uma conta gratuita" canonical="/auth/register" />
      <h1 className="text-3xl font-bold text-foreground">Registar</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Nome" required />
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Email" type="email" required />
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Palavra-passe" type="password" required />
        <Button type="submit" variant="hero">Criar conta</Button>
      </form>
    </div>
  );
};

export default AuthRegister;
