import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Header = () => {
  return <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 bg-[#073135]">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="text-xl">PortalEmpresa</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/noticias" className={({
          isActive
        }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Notícias</NavLink>
          <NavLink to="/ofertas" className={({
          isActive
        }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Ofertas</NavLink>
          <NavLink to="/empresas" className={({
          isActive
        }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Empresas</NavLink>
          <NavLink to="/contato" className={({
          isActive
        }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Contato</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth/login"><Button variant="outline" size="sm">Entrar</Button></Link>
          <Link to="/auth/register"><Button variant="hero" size="sm">Registar</Button></Link>
        </div>
      </div>
    </header>;
};
export default Header;