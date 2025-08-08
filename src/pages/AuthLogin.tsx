import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AuthLogin = () => {
  const onSubmit = (e: React.FormEvent) => e.preventDefault();
  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Seo title="Entrar — PortalEmpresa" description="Aceda à sua conta" canonical="/auth/login" />
      <h1 className="text-3xl font-bold text-foreground">Entrar</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Email" type="email" required />
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Palavra-passe" type="password" required />
        <Button type="submit" variant="hero">Entrar</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">Não tem conta? <Link to="/auth/register" className="underline text-primary">Registar</Link></p>
    </div>
  );
};

export default AuthLogin;
