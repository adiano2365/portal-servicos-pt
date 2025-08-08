const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-foreground">PortalEmpresa</h3>
          <p className="text-sm text-muted-foreground mt-2">Conectamos empresas e provedores de serviços em Portugal.</p>
        </div>
        <div>
          <h4 className="font-medium text-foreground">Links úteis</h4>
          <ul className="mt-2 text-sm text-muted-foreground space-y-2">
            <li><a href="/noticias" className="hover:text-foreground">Notícias</a></li>
            <li><a href="/ofertas" className="hover:text-foreground">Ofertas</a></li>
            <li><a href="/empresas" className="hover:text-foreground">Empresas</a></li>
            <li><a href="/contato" className="hover:text-foreground">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground">Legal</h4>
          <ul className="mt-2 text-sm text-muted-foreground space-y-2">
            <li><a href="#" className="hover:text-foreground">Termos</a></li>
            <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} PortalEmpresa. Todos os direitos reservados.</div>
    </footer>
  );
};

export default Footer;
