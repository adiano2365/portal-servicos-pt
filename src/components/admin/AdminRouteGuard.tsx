
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Separa a verificação do papel numa função
  const checkAdminRole = async (userId: string) => {
    console.log("[AdminRouteGuard] Verificando papel para", userId);
    const { data, error } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("[AdminRouteGuard] Erro ao verificar papel:", error.message);
    }
    setIsAdmin(!!data);
    setLoading(false);
  };

  useEffect(() => {
    // 1) Registrar o listener de auth ANTES de getSession
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AdminRouteGuard] Auth event:", event);
      const userId = session?.user?.id;
      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Evitar deadlocks: não chamar Supabase direto no callback
      setTimeout(() => {
        checkAdminRole(userId);
      }, 0);
    });

    // 2) Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id;
      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      checkAdminRole(userId);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        A carregar...
      </div>
    );
  }

  if (!isAdmin) {
    console.log("[AdminRouteGuard] Utilizador não é admin. Redirecionando para /admin/login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

