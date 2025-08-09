import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  CreditCard,
  History,
  DollarSign,
  UserCog,
  UserCheck,
  Mail,
  Settings,
} from "lucide-react";

const items = [
  { title: "Painel", url: "/admin", icon: Home },
  { title: "Funcionários", url: "/admin/funcionarios", icon: UserCog },
  { title: "Utilizadores", url: "/admin/utilizadores", icon: Users },
  { title: "Empresas", url: "/admin/empresas", icon: Building2 },
  { title: "Consultores", url: "/admin/consultores", icon: UserCheck },
  { title: "Vagas", url: "/admin/vagas", icon: BriefcaseBusiness },
  { title: "Bolsas de Estudo", url: "/admin/bolsas", icon: GraduationCap },
  { title: "Subscrições", url: "/admin/subscricoes", icon: CreditCard },
  { title: "Consultorias", url: "/admin/consultorias", icon: DollarSign },
  { title: "Gestão de Email", url: "/admin/email", icon: Mail },
  { title: "Public Configurations", url: "/admin/public-configurations", icon: Settings },
  { title: "Histórico", url: "/admin/historico", icon: History },
  { title: "Pagamentos de Serviço", url: "/admin/pagamentos", icon: CreditCard },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isExpanded = useMemo(() => items.some((i) => currentPath === i.url), [currentPath]);
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/60"}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup /* keep group open logic for future if needed: isExpanded */>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
