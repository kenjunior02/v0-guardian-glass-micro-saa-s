import Link from "next/link"
import { Shield, Brain, Smartphone, Users, CheckCircle2, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b glass sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">GuardianGlass</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Funcionalidades
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Preços
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Button size="sm" asChild>
            <Link href="/guard">Demo Guarda</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1 text-ai border-ai/30 ai-glow">
                  IA de Segurança Moçambicana 🇲🇿
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-balance max-w-[800px]">
                  Segurança Inteligente com <span className="text-ai">IA Gratuita</span> Integrada
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-pretty">
                  Transforme a segurança da sua empresa com monitoramento em tempo real, transcrição de voz e análise de
                  sentimento. O primeiro MicroSaaS focado no mercado de Moçambique.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link href="/register">Começar Trial de 14 Dias</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg glass bg-transparent" asChild>
                  <Link href="#demo">Ver Demo</Link>
                </Button>
              </div>
              <div className="pt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Sem cartão de crédito
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Suporte M-Pesa
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Offline-first
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tecnologia que Salva Vidas</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Integramos as tecnologias mais avançadas para garantir que sua equipe esteja sempre protegida e
                eficiente.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-ai/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-ai" />
                  </div>
                  <CardTitle>IA de Voz Nativa</CardTitle>
                  <CardDescription>
                    Transcrição em tempo real (PT) e análise de sentimento para detectar guardas nervosos ou situações
                    de risco.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>PWA Offline-first</CardTitle>
                  <CardDescription>
                    Funciona perfeitamente em áreas com sinal fraco. Sincroniza dados automaticamente quando a conexão
                    retorna.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <CardTitle>M-Pesa Integrado</CardTitle>
                  <CardDescription>
                    Pagamentos fáceis e locais via M-Pesa e e-Mola. Ativação automática via SMS de confirmação.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardTitle>Geofencing Inteligente</CardTitle>
                  <CardDescription>
                    Alertas automáticos se um guarda sair da área designada. Monitoramento de velocidade e trajetos.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-500" />
                  </div>
                  <CardTitle>Alertas WhatsApp</CardTitle>
                  <CardDescription>
                    Clientes recebem relatórios de anomalias e alertas SOS diretamente no WhatsApp em tempo real.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="glass border-none shadow-xl hover:translate-y-[-4px] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <CardTitle>Check-in QR Code</CardTitle>
                  <CardDescription>
                    Verificação presencial em pontos estratégicos via escaneamento de QR Code com foto comprobatória.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Planos Acessíveis para Cada Empresa</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Preços locais em Meticais (MZN) com faturamento mensal simplificado.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="flex flex-col h-full border-muted/20">
                <CardHeader>
                  <CardTitle>Trial</CardTitle>
                  <CardDescription>Explore a plataforma</CardDescription>
                  <div className="text-3xl font-bold mt-4">Grátis</div>
                  <div className="text-sm text-muted-foreground">14 dias de teste</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> 1 Guarda
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> IA Básica
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Dashboard Web
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent" variant="outline">
                    Começar Grátis
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col h-full border-muted/20">
                <CardHeader>
                  <CardTitle>Básico</CardTitle>
                  <CardDescription>Pequenas empresas</CardDescription>
                  <div className="text-3xl font-bold mt-4">1.500 MZN</div>
                  <div className="text-sm text-muted-foreground">por mês</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> 5 Guardas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> IA Essencial
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Suporte M-Pesa
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Assinar Agora</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col h-full border-primary shadow-lg scale-105 bg-primary/5">
                <CardHeader>
                  <div className="absolute top-[-12px] left-1/2 translate-x-[-50%]">
                    <Badge className="bg-primary text-primary-foreground">MAIS POPULAR</Badge>
                  </div>
                  <CardTitle>PRO</CardTitle>
                  <CardDescription>Empresas em crescimento</CardDescription>
                  <div className="text-3xl font-bold mt-4">4.500 MZN</div>
                  <div className="text-sm text-muted-foreground">por mês</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> 20 Guardas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> IA Avançada
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Alertas WhatsApp
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Assinar Agora</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col h-full border-muted/20">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>Segurança total</CardDescription>
                  <div className="text-3xl font-bold mt-4">15.000 MZN</div>
                  <div className="text-sm text-muted-foreground">por mês</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Guardas Ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> API de IA Dedicada
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Suporte VIP 24/7
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent" variant="outline">
                    Contactar Vendas
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Pronto para o futuro da segurança?</h2>
                <p className="text-primary-foreground/80 md:text-xl">
                  Junte-se a mais de 47 empresas moçambicanas que já modernizaram suas operações com o GuardianGlass.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-bold">
                    Iniciar Teste Grátis
                  </Button>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">
                      M
                    </div>
                    <span className="text-sm font-medium">Aceitamos M-Pesa & e-Mola</span>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-full max-w-[400px] h-[500px] glass-dark rounded-[3rem] border-8 border-slate-900 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 translate-x-[-50%] w-32 h-6 bg-slate-900 rounded-b-xl z-20" />
                  <div className="p-6 pt-12 space-y-4">
                    <div className="flex items-center justify-between text-white/60 text-xs">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <Zap className="w-3 h-3 fill-white" />
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="bg-primary/20 p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">Ronda Ativa</span>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      </div>
                      <div className="text-white/60 text-sm">Local: Condomínio Jasmim</div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-2/3" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        </div>
                      ))}
                    </div>
                    <div className="bg-ai/20 p-4 rounded-2xl border border-ai/30 ai-glow">
                      <div className="flex items-center gap-2 text-ai mb-1">
                        <Brain className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">IA Guardian</span>
                      </div>
                      <p className="text-white text-xs leading-relaxed">
                        "Voz do guarda detectada como calma. Nenhuma palavra-chave de risco encontrada nos últimos 15
                        min."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-ai/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t glass">
        <p className="text-xs text-muted-foreground">
          © 2025 GuardianGlass Lda. Todos os direitos reservados. Made with ❤️ in Maputo.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacidade
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Contactar Suporte
          </Link>
        </nav>
      </footer>
    </div>
  )
}
