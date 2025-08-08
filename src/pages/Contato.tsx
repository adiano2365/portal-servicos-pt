import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const Contato = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em breve: validação + reCAPTCHA + envio
  };
  return (
    <div className="container mx-auto px-4 py-10">
      <Seo title="Contato — PortalEmpresa" description="Fale connosco" canonical="/contato" />
      <h1 className="text-3xl font-bold text-foreground">Contato</h1>
      <p className="mt-2 text-muted-foreground">Envie-nos uma mensagem e responderemos o mais breve possível.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 max-w-xl">
        <input className="border rounded-md px-3 py-2 bg-background" placeholder="Nome" required />
        <input type="email" className="border rounded-md px-3 py-2 bg-background" placeholder="Email" required />
        <textarea className="border rounded-md px-3 py-2 bg-background" placeholder="Mensagem" rows={5} required />
        <Button type="submit" variant="hero" className="justify-self-start">Enviar</Button>
      </form>
    </div>
  );
};

export default Contato;
