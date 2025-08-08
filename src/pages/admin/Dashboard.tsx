import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  UserPlus,
  Building2,
  ListChecks,
  CalendarCheck2,
  CircleX,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Clock
} from "lucide-react";
import Seo from "@/components/Seo";

const StatCard = ({
  title,
  value,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  value: string | number;
  icon: any;
  tone?: "primary" | "success" | "warning" | "destructive" | "muted";
}) => {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-foreground/70",
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-0">
      <Seo title="Painel do Admin — PortalEmpresa" description="Visão geral das estatísticas do sistema" canonical="/admin" />
      <h1 className="text-3xl font-bold text-foreground mb-2">Painel</h1>
      <p className="text-muted-foreground mb-6">Visão geral das estatísticas do seu sistema</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Utilizadores" value={1} icon={Users} tone="primary" />
        <StatCard title="Total Candidatos" value={73} icon={UserPlus} tone="success" />
        <StatCard title="Total empresas" value={9} icon={Building2} tone="destructive" />

        <StatCard title="Total de Consultorias" value={12} icon={ListChecks} tone="muted" />
        <StatCard title="Consultas Completadas" value={0} icon={BadgeCheck} tone="success" />
        <StatCard title="Consultas Agendadas" value={4} icon={CalendarDays} tone="warning" />

        <StatCard title="Consultas Canceladas" value={0} icon={CircleX} tone="destructive" />
        <StatCard title="Consultas Confirmadas" value={8} icon={BadgeCheck} tone="primary" />
        <StatCard title="Próximas Consultas" value={1} icon={CalendarCheck2} tone="primary" />

        <StatCard title="Receita Total de Consultas" value={"3000.00 MZN"} icon={CircleDollarSign} tone="success" />
        <StatCard title="Valor Pendente das Consultas" value={"2250.00 MZN"} icon={Clock} tone="warning" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Meta semanal</div>
              <Progress value={42} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Captação de Novos Utilizadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Meta mensal</div>
              <Progress value={68} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
