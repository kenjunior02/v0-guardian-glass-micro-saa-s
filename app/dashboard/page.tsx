"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Users,
  MapIcon,
  Brain,
  BarChart3,
  Search,
  Bell,
  MoreVertical,
  Activity,
  AlertTriangle,
  TrendingUp,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

type Patrol = {
  id: number
  guard_name: string
  location: string
  started_at: string
  ended_at?: string
  status: string
  sentiment_score?: number
  ai_risk_score?: number
}

type Guard = {
  id: number
  name: string
  status: string
  badge_number: string
  patrol_streak: number
  total_patrols: number
  ranking_score: number
  company_name: string
}

export default function SupervisorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("live")
  const [patrols, setPatrols] = useState<Patrol[]>([])
  const [guards, setGuards] = useState<Guard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.user && (data.user.role === "supervisor" || data.user.role === "admin")) {
          setUser(data.user)
        } else {
          window.location.href = "/login"
        }
      } catch (error) {
        window.location.href = "/login"
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [patrolsRes, guardsRes] = await Promise.all([
          fetch(`/api/patrols/history?company_id=${user.company_id}&limit=10`),
          fetch(`/api/guards/list?company_id=${user.company_id}`),
        ])

        const patrolsData = await patrolsRes.json()
        const guardsData = await guardsRes.json()

        if (patrolsData.success) {
          setPatrols(patrolsData.patrols)
        }

        if (guardsData.success) {
          setGuards(guardsData.guards)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [user])

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 glass border-r hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">GuardianGlass</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "live", label: "Mapa Live", icon: MapIcon },
            { id: "locais", label: "Locais", icon: MapPin },
            { id: "guardas", label: "Equipe", icon: Users },
            { id: "ia", label: "IA Analytics", icon: Brain },
            { id: "relatorios", label: "Relatórios", icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t space-y-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Trial Status</span>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5">
                12d rest
              </Badge>
            </div>
            <Progress value={85} className="h-1 bg-primary/10" />
            <p className="text-[10px] text-muted-foreground mt-2">Plano PRO ativo</p>
          </div>
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarImage src="/avatar-admin.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || "Supervisor"}</p>
              <Button variant="link" className="p-0 h-auto text-[10px] text-destructive" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b glass flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg hidden md:block">Dashboard</h1>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar guarda ou local..."
                className="pl-9 h-9 rounded-full bg-muted/50 border-none focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold">{guards.filter((g) => g.status === "active").length} Ativos</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </Button>
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src="/avatar-admin.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "live" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card className="glass border-none shadow-lg rounded-[2rem] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-bold tracking-wider">
                      Guardas Ativos
                    </CardDescription>
                    <CardTitle className="text-4xl font-black">
                      {guards.filter((g) => g.status === "active").length}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="glass border-none shadow-lg rounded-[2rem] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-bold tracking-wider">
                      Rondas Hoje
                    </CardDescription>
                    <CardTitle className="text-4xl font-black">
                      {patrols.filter((p) => p.status === "completed").length}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="glass border-none shadow-lg rounded-[2rem] overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-bold tracking-wider">IA Score</CardDescription>
                    <CardTitle className="text-4xl font-black text-ai">
                      {patrols.length > 0
                        ? Math.round(
                            (patrols.reduce((acc, p) => acc + (p.sentiment_score || 0), 0) / patrols.length) * 100,
                          )
                        : 0}
                      %
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="glass border-none shadow-lg rounded-[2rem] overflow-hidden border-destructive/20">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-bold tracking-wider text-destructive">
                      Alertas SOS
                    </CardDescription>
                    <CardTitle className="text-4xl font-black text-destructive">
                      {patrols.filter((p) => p.status === "sos").length}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Map Placeholder */}
                <Card className="lg:col-span-2 h-[500px] overflow-hidden rounded-[2rem] border-none shadow-xl relative glass">
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <img
                      src="/city-map-dark-satellite-security-nodes.jpg"
                      alt="Mapa Live"
                      className="w-full h-full object-cover opacity-50 dark:opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    {/* Simulated Map Pins */}
                    <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-success/20 animate-ping absolute -inset-0" />
                        <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center border-4 border-background shadow-lg relative">
                          <Users className="w-4 h-4 text-background" />
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <Badge className="bg-background text-foreground glass border-primary/20">
                            {patrols.length > 0 && patrols[0].status === "active"
                              ? `${patrols[0].guard_name} - ${patrols[0].location}`
                              : "Guarda João - Casa Silva"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-destructive/20 animate-ping absolute -inset-0" />
                        <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center border-4 border-background shadow-lg relative">
                          <AlertTriangle className="w-4 h-4 text-background" />
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <Badge className="bg-destructive text-white border-none shadow-lg">
                            ALERTA SOS - Condomínio Jasmim
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Overlays */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-none shadow-lg">
                      <MapIcon className="w-3 h-3 mr-1" /> Mapa Operacional
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl flex items-center justify-between shadow-2xl border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-destructive/10 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-destructive">EMERGÊNCIA ATIVA</p>
                        <p className="text-sm font-medium">SOS acionado em 'Condomínio Jasmim' há 2min</p>
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" className="rounded-xl px-6">
                      VER DETALHES
                    </Button>
                  </div>
                </Card>

                {/* Live Feed Sidebar */}
                <div className="space-y-4 flex flex-col">
                  <Card className="rounded-[2rem] border-none shadow-xl glass shrink-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">IA Insights (Tempo Real)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-ai/10 flex items-center justify-center shrink-0">
                          <Brain className="w-4 h-4 text-ai" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold">
                            {guards.filter((g) => g.ranking_score < 800).length} Guardas Lentos
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">Ritmo abaixo da média</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4 text-warning" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold">
                            Risco Médio: {patrols.length > 0 ? Math.round((patrols[0].ai_risk_score || 0.3) * 100) : 30}
                            %
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">Baseado em análise preditiva</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-none shadow-xl glass flex-1 overflow-hidden flex flex-col">
                    <CardHeader className="pb-2 shrink-0">
                      <CardTitle className="text-sm">Últimas Atividades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 overflow-y-auto">
                      {loading ? (
                        <p className="text-xs text-muted-foreground">Carregando...</p>
                      ) : patrols.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Nenhuma atividade recente</p>
                      ) : (
                        patrols.slice(0, 5).map((patrol, i) => (
                          <div
                            key={patrol.id}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div className="flex items-center gap-2 flex-1 overflow-hidden">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  patrol.status === "active"
                                    ? "bg-success"
                                    : patrol.status === "sos"
                                      ? "bg-destructive"
                                      : "bg-muted"
                                }`}
                              />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-medium truncate">{patrol.guard_name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{patrol.location}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {timeAgo(patrol.started_at)}
                            </Badge>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ia" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Análise Preditiva Guardian IA</h2>
                  <p className="text-muted-foreground">Processamento inteligente de 1.247h de áudio este mês.</p>
                </div>
                <Button className="bg-ai text-ai-foreground ai-glow rounded-xl">
                  <Brain className="w-4 h-4 mr-2" /> Gerar Novo Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass border-none shadow-lg rounded-2xl">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Resumo Voz</p>
                    <p className="text-3xl font-bold">18</p>
                    <p className="text-xs text-success font-medium flex items-center">
                      <Activity className="w-3 h-3 mr-1" /> 2 anomalias tratadas
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass border-none shadow-lg rounded-2xl">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Sentimento Médio</p>
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-xs text-ai font-medium">Equipe estável e alerta</p>
                  </CardContent>
                </Card>
                <Card className="glass border-none shadow-lg rounded-2xl">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Precisão Predição</p>
                    <p className="text-3xl font-bold">96%</p>
                    <p className="text-xs text-primary font-medium">Média do último trimestre</p>
                  </CardContent>
                </Card>
                <Card className="glass border-none shadow-lg rounded-2xl">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Tempo Médio Resposta</p>
                    <p className="text-3xl font-bold">4.2m</p>
                    <p className="text-xs text-destructive font-medium">-12% vs mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden">
                  <CardHeader>
                    <CardTitle>Mapa de Calor de Riscos (IA)</CardTitle>
                    <CardDescription>Onde e quando os incidentes são mais prováveis.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-64 bg-primary/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-10">
                      <img src="/abstract-risk-heatmap-security.jpg" alt="Heatmap" />
                    </div>
                    <div className="p-6 glass rounded-2xl border-white/20 text-center space-y-2 z-10 max-w-xs">
                      <p className="text-sm font-bold text-ai uppercase tracking-widest">ALERTA PREDITIVO</p>
                      <p className="text-base font-medium leading-tight">
                        "Sexta-feira (20h-23h) apresenta 85% de risco elevado na Zona Sul."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-7 px-4 rounded-full border-ai/50 text-ai bg-transparent"
                      >
                        SABER MAIS
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden">
                  <CardHeader>
                    <CardTitle>Performance por Turno</CardTitle>
                    <CardDescription>Eficiência da ronda detectada pela IA.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-end justify-between px-12 pb-12 gap-4">
                    {[65, 80, 45, 95, 70, 85].map((val, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 w-full group">
                        <div
                          className={`w-full rounded-t-xl transition-all group-hover:brightness-110 shadow-lg ${i === 3 ? "bg-ai ai-glow" : "bg-primary/20"}`}
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[10px] font-bold text-muted-foreground">{`T${i + 1}`}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "guardas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Equipe de Guardas</h2>
                  <p className="text-sm text-muted-foreground">
                    {guards.length} guardas cadastrados · {guards.filter((g) => g.status === "active").length} ativos
                    agora
                  </p>
                </div>
                <Button className="rounded-xl gap-2">
                  <Users className="w-4 h-4" /> Adicionar Guarda
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p className="text-sm text-muted-foreground col-span-full">Carregando guardas...</p>
                ) : guards.length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-full">
                    Nenhum guarda cadastrado. Execute os scripts SQL para popular o banco de dados.
                  </p>
                ) : (
                  guards.map((guard, i) => (
                    <Card
                      key={guard.id}
                      className="glass border-none shadow-lg rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-transform"
                    >
                      <CardContent className="p-0">
                        <div className="p-6 flex items-start justify-between">
                          <div className="flex gap-4">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                              <AvatarImage src={`/guard-face-${(i % 5) + 1}.jpg`} />
                              <AvatarFallback>{guard.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold">{guard.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${guard.status === "active" ? "bg-success" : "bg-muted"}`}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {guard.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="px-6 pb-6 space-y-4">
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Distintivo</p>
                              <p className="text-xs font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" /> {guard.badge_number}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Patrulhas</p>
                              <p className="text-xs font-bold text-success">{guard.total_patrols}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-muted-foreground">Ranking Score</span>
                              <span className="text-primary">{guard.ranking_score} pts</span>
                            </div>
                            <Progress value={guard.ranking_score / 10} className="h-1.5 bg-primary/10" />
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mr-2 rounded-xl text-xs h-8 glass bg-transparent"
                          >
                            VER ROTA
                          </Button>
                          <Button variant="default" size="sm" className="w-full rounded-xl text-xs h-8">
                            LIGAR IA
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
