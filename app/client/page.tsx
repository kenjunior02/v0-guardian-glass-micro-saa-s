"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
  Shield,
  Brain,
  MessageSquare,
  FileText,
  Play,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientPortal() {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/auth/me")
        const authData = await authRes.json()

        if (authData.user && authData.user.role === "client") {
          setUser(authData.user)

          const reportsRes = await fetch(`/api/patrols/history?company_id=${authData.user.company_id}&limit=5`)
          const reportsData = await reportsRes.json()
          if (reportsData.success) {
            setReports(reportsData.patrols)
          }
        } else {
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("[v0] Client portal init error:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleShareWhatsApp = (report: any) => {
    const message = `GuardianGlass: Relatório de Ronda - ${new Date(report.started_at).toLocaleDateString()}\nStatus: ${report.status}\nLocal: ${report.location}\nAnálise IA: Ronda estável.`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="h-16 border-b glass sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:block">GuardianGlass</span>
          <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block" />
          <p className="text-sm font-medium text-muted-foreground">Portal do Cliente</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-ai/10 text-ai px-3 py-1 rounded-full border border-ai/20">
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Guard Ativo</span>
          </div>
          <Avatar className="h-8 w-8 border border-primary/20 cursor-pointer" onClick={handleLogout}>
            <AvatarImage src="/avatar-client.jpg" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{user?.name || "Cliente"} 👋</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao resumo de segurança da{" "}
              <span className="text-foreground font-semibold underline decoration-primary/30">
                {user?.company_name || "Sua Empresa"}
              </span>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* AI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6">
              <div className="w-12 h-12 rounded-full bg-ai/10 flex items-center justify-center ai-glow group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-ai" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Cobertura IA (30d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-black tracking-tighter">93%</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-success">EFICIÊNCIA ALTA</span>
                  <span>+2% vs Nov</span>
                </div>
                <Progress value={93} className="h-1.5 bg-primary/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Incidentes / SOS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-black tracking-tighter">02</div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  Resposta média: <span className="font-bold text-foreground">4min</span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-warning" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Anomalias IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-black tracking-tighter text-warning">03</div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                "IA detectou falha recorrente no <span className="font-bold">Portão Principal</span> (3x). Recomendada
                manutenção."
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports Table */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Relatórios Recentes
            </h2>
            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Data</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Cobertura</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Eventos</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Resumo IA</th>
                      <th className="p-4 text-xs font-bold text-muted-foreground uppercase text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground italic">
                          Carregando relatórios...
                        </td>
                      </tr>
                    ) : reports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground italic">
                          Nenhum relatório encontrado.
                        </td>
                      </tr>
                    ) : (
                      reports.map((report, i) => (
                        <tr key={report.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="p-4 text-sm font-medium">
                            {new Date(report.started_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">92%</span>
                              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-primary" style={{ width: "92%" }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold border-none uppercase",
                                report.status === "sos"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-success/10 text-success",
                              )}
                            >
                              {report.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-[200px] truncate italic">
                            "{report.location}"
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-all"
                              onClick={() => handleShareWhatsApp(report)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-success" /> Alertas WhatsApp
            </h2>
            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden bg-emerald-500/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase">Configurado ✅</p>
                    <p className="text-sm font-medium">+258 84 xxx xxx</p>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-emerald-500/20 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Último Alerta</p>
                  <p className="text-xs leading-relaxed italic">
                    "GuardianGlass: SOS acionado na Casa Silva às 22:15. Supervisor a caminho. Resposta em 3.4min."
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="p-0 h-auto text-xs text-emerald-600 font-bold hover:no-underline"
                  >
                    TESTAR AGORA <ChevronRight className="w-3 h-3 inline ml-1" />
                  </Button>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                  Gerir Notificações
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden border-ai/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Último Evento SOS (Áudio)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">28/12 - 22:15</p>
                      <p className="text-[10px] text-muted-foreground">Gravação da ronda SOS</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 bg-destructive/10 text-destructive border-none">
                    SOS
                  </Badge>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-ai mb-1">
                    <Brain className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Transcrição IA</span>
                  </div>
                  <p className="text-xs italic text-muted-foreground leading-relaxed">
                    "...ouvi barulho no portão traseiro... solicitando verificação imediata..."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action for Support */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="h-14 w-14 rounded-full shadow-2xl ai-glow bg-ai hover:bg-ai/90 text-white group">
          <Brain className="w-6 h-6 group-hover:animate-pulse" />
        </Button>
      </div>
    </div>
  )
}
