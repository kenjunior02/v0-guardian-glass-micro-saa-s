"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
  Shield,
  LayoutDashboard,
  Building2,
  CreditCard,
  Brain,
  Settings,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("global")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/auth/me")
        const authData = await authRes.json()

        if (authData.user && authData.user.role === "admin") {
          setUser(authData.user)

          const paymentsRes = await fetch("/api/mpesa/history")
          const paymentsData = await paymentsRes.json()
          if (paymentsData.success) {
            setPayments(paymentsData.payments)
          }
        } else {
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("[v0] Admin init error:", error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 glass border-r hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">GuardianGlass</span>
          <Badge className="ml-1 text-[10px] bg-primary/10 text-primary border-primary/20 h-4 px-1 uppercase">
            Super
          </Badge>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "global", label: "Visão Global", icon: LayoutDashboard },
            { id: "empresas", label: "Empresas", icon: Building2 },
            { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
            { id: "ia-stats", label: "IA Usage", icon: Brain },
            { id: "config", label: "Configuração", icon: Settings },
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
        <div className="p-6 mt-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src="/avatar-super-admin.jpg" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || "Super Admin"}</p>
              <p className="text-[10px] text-muted-foreground truncate">Sair do sistema</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b glass flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">Administração Global</h1>
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar empresa..."
                className="pl-9 h-9 rounded-full bg-muted/50 border-none focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="rounded-xl h-9">
              <Plus className="w-4 h-4 mr-2" /> Nova Empresa
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <Badge className="bg-success/10 text-success border-none text-[10px]">TOTAL</Badge>
                </div>
                <p className="text-3xl font-black tracking-tighter">47</p>
                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Empresas Ativas</p>
                <div className="flex items-center gap-1 mt-4 text-[10px] text-success font-bold">
                  <ArrowUpRight className="w-3 h-3" /> +12% este mês
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none text-[10px]">RECEITA</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black tracking-tighter">2.1M</p>
                  <p className="text-xs font-bold text-muted-foreground">MZN</p>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Faturamento Mensal</p>
                <div className="flex items-center gap-1 mt-4 text-[10px] text-primary font-bold">
                  <TrendingUp className="w-3 h-3" /> Meta 2.5M
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-ai/10 rounded-xl">
                    <Brain className="w-5 h-5 text-ai" />
                  </div>
                  <Badge className="bg-ai/10 text-ai border-none text-[10px]">IA USAGE</Badge>
                </div>
                <p className="text-3xl font-black tracking-tighter">1.2k</p>
                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Horas de Transcrição</p>
                <div className="flex items-center gap-1 mt-4 text-[10px] text-ai font-bold">
                  <CheckCircle2 className="w-3 h-3" /> 92% Precisão
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl glass overflow-hidden border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <Badge className="bg-orange-500/10 text-orange-500 border-none text-[10px]">PENDENTE</Badge>
                </div>
                <p className="text-3xl font-black tracking-tighter text-orange-500">03</p>
                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Pagamentos M-Pesa</p>
                <div className="flex items-center gap-1 mt-4 text-[10px] text-orange-500 font-bold">
                  <MessageSquare className="w-3 h-3" /> Enviar SMS Cobrança
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Payments Table */}
            <Card className="xl:col-span-2 rounded-[2.5rem] border-none shadow-xl glass overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pagamentos Recentes</CardTitle>
                <CardDescription>Validação manual de M-Pesa e e-Mola</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-y bg-muted/20">
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Empresa</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Referência</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Plano</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Valor</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground italic">
                            Carregando pagamentos...
                          </td>
                        </tr>
                      ) : payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground italic">
                            Nenhum pagamento registrado.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="text-sm font-bold">Empresa #{payment.company_id.slice(0, 8)}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-xs font-mono">{payment.reference}</p>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="text-[10px] font-bold h-5 uppercase">
                                PRO
                              </Badge>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-bold">{payment.amount} MZN</p>
                            </td>
                            <td className="p-4">
                              <Badge
                                className={cn(
                                  "text-[10px] font-bold border-none uppercase",
                                  payment.status === "pending"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "bg-success/10 text-success",
                                )}
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* AI Global Metrics */}
            <Card className="rounded-[2.5rem] border-none shadow-xl glass overflow-hidden border-ai/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-ai" /> Métricas Globais IA
                </CardTitle>
                <CardDescription>Uso de infraestrutura de IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Alertas Gerados</span>
                    <span className="text-ai">4,287</span>
                  </div>
                  <div className="h-2 w-full bg-ai/5 rounded-full overflow-hidden">
                    <div className="h-full bg-ai w-3/4 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Precisão Predições</span>
                    <span className="text-success">92%</span>
                  </div>
                  <div className="h-2 w-full bg-success/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[92%]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Top Palavras Risco
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["intruso", "arma", "suspeito", "portão", "fogo"].map((word) => (
                      <Badge key={word} variant="secondary" className="bg-muted/50 text-[10px] lowercase px-2 h-6">
                        #{word}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Destaque Admin</p>
                  <p className="text-xs leading-relaxed">
                    IA detectou aumento de 24% em tentativas de intrusão na região de Maputo-Cidade esta semana.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
