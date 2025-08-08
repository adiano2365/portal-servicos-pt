import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2 text-foreground">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Página não encontrada</p>
        <a href="/" className="underline text-primary hover:opacity-90">Voltar à página inicial</a>
      </div>
    </div>
  );
};

export default NotFound;
