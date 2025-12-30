"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Play,
  CheckCircle2,
  QrCode,
  Mic,
  AlertTriangle,
  Zap,
  MapPin,
  RefreshCcw,
  Battery,
  User,
  Brain,
  TrendingUp,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function GuardPWA() {
  const [guardId] = useState(1) // Demo: user_id from database
  const [guardInternalId] = useState(1) // Demo: guard table id
  const [companyId] = useState(1) // Demo: company_id
  const [activeTab, setActiveTab] = useState("ronda")
  const [isPatrolling, setIsPatrolling] = useState(false)
  const [bluetoothDevice, setBluetoothDevice] = useState<any | null>(null) // allow any for device object
  const [isConnecting, setIsConnecting] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const deviceRef = useRef<any>(null) // guardamos a referência do objeto real do dispositivo para reconexão
  const [currentPatrolId, setCurrentPatrolId] = useState<number | null>(null)
  const [timer, setTimer] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [lastTranscription, setLastTranscription] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState("Aguardando voz...")

  // Timer logic for patrol
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPatrolling) {
      interval = setInterval(() => {
        setTimer((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPatrolling])

  useEffect(() => {
    const checkActivePatrol = async () => {
      try {
        const res = await fetch(`/api/patrols/active?guard_id=${guardId}`)
        const data = await res.json()
        if (data.success && data.patrol) {
          setCurrentPatrolId(data.patrol.id)
          setIsPatrolling(true)
          const startedAt = new Date(data.patrol.started_at)
          const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000)
          setTimer(elapsed)
        }
      } catch (error) {
        console.error("[v0] Failed to check active patrol:", error)
      }
    }
    checkActivePatrol()
  }, [guardId])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const togglePatrol = async () => {
    if (isPatrolling) {
      // Stop patrol
      if (currentPatrolId) {
        try {
          const res = await fetch("/api/patrols/stop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patrol_id: currentPatrolId,
              sentiment_score: 0.78,
              ai_risk_score: 0.25,
            }),
          })
          const data = await res.json()
          if (data.success) {
            console.log("[v0] Patrol stopped and saved to DB")
            setIsPatrolling(false)
            setCurrentPatrolId(null)
            setTimer(0)
          }
        } catch (error) {
          console.error("[v0] Failed to stop patrol:", error)
        }
      }
    } else {
      // Start patrol
      try {
        const res = await fetch("/api/patrols/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guard_id: guardInternalId,
            company_id: companyId,
            location: "Casa Silva",
            latitude: -25.9655,
            longitude: 32.5832,
          }),
        })
        const data = await res.json()
        if (data.success) {
          console.log("[v0] Patrol started:", data.patrol)
          setCurrentPatrolId(data.patrol.id)
          setIsPatrolling(true)
        }
      } catch (error) {
        console.error("[v0] Failed to start patrol:", error)
      }
    }
  }

  // Web Speech API Integration
  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Seu navegador não suporta reconhecimento de voz.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "pt-PT"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setLastTranscription(text)

      // Simple AI analysis logic
      const isRisk = text.includes("intruso") || text.includes("arma") || text.includes("suspeito")
      if (isRisk) {
        setAiAnalysis("🚨 RISCO DETECTADO! Ativando SOS...")
      } else {
        setAiAnalysis("✅ Voz normal, sem riscos detectados.")
      }

      try {
        await fetch("/api/voice-reports/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patrol_id: currentPatrolId,
            guard_id: guardInternalId,
            transcript: text,
            sentiment_score: isRisk ? 0.3 : 0.8,
            keywords: text.split(" ").slice(0, 5),
            is_sos: isRisk,
          }),
        })
        console.log("[v0] Voice report saved to DB")
      } catch (error) {
        console.error("[v0] Failed to save voice report:", error)
      }
    }

    recognition.start()
  }

  const attemptAutoReconnection = useCallback(async () => {
    if (!navigator.bluetooth || !("getDevices" in navigator.bluetooth)) return

    try {
      console.log("[v0] Verificando dispositivos Bluetooth já permitidos...")
      // @ts-ignore - getDevices é suportado em navegadores modernos mas pode não estar nos tipos padrão
      const devices = await navigator.bluetooth.getDevices()

      if (devices.length > 0) {
        const lastDevice = devices[0]
        console.log("[v0] Dispositivo encontrado, tentando reconectar:", lastDevice.name)

        lastDevice.addEventListener("gattserverdisconnected", onDisconnected)

        if (!lastDevice.gatt?.connected) {
          const server = await lastDevice.gatt?.connect()
          if (server) {
            setupDevice(lastDevice)
          }
        } else {
          setupDevice(lastDevice)
        }
      }
    } catch (error) {
      console.warn("[v0] Falha na reconexão automática:", error)
    }
  }, [])

  useEffect(() => {
    attemptAutoReconnection()
  }, [attemptAutoReconnection])

  const onDisconnected = useCallback(
    (event: any) => {
      const device = event.target
      console.log(`[v0] Dispositivo ${device.name} desconectado.`)
      setBluetoothDevice(null)
      setBatteryLevel(null)
      deviceRef.current = null

      setTimeout(() => {
        if (document.visibilityState === "visible") {
          attemptAutoReconnection()
        }
      }, 3000)
    },
    [attemptAutoReconnection],
  )

  const setupDevice = useCallback(async (device: any) => {
    deviceRef.current = device
    const deviceInfo = {
      name: device.name || "Guardian Glass Device",
      id: device.id,
      connected: true,
    }
    setBluetoothDevice(deviceInfo)

    try {
      const server = device.gatt?.connected ? device.gatt : await device.gatt?.connect()
      if (server) {
        // Tentativa de ler bateria de forma robusta
        try {
          const service = await server.getPrimaryService("battery_service")
          const characteristic = await service.getCharacteristic("battery_level")
          const value = await characteristic.readValue()
          setBatteryLevel(value.getUint8(0))

          await characteristic.startNotifications()
          characteristic.addEventListener("characteristicvaluechanged", (e: any) => {
            setBatteryLevel(e.target.value.getUint8(0))
          })
        } catch (e) {
          console.warn("[v0] Serviços de telemetria não disponíveis:", e)
        }
      }
    } catch (err) {
      console.error("[v0] Erro ao configurar dispositivo:", err)
    }
  }, [])

  const connectBluetooth = async () => {
    if (!navigator.bluetooth) {
      alert("Seu navegador não suporta Bluetooth. Use Chrome ou Edge.")
      return
    }

    try {
      setIsConnecting(true)
      console.log("[v0] Solicitando permissão para novo dispositivo...")

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "device_information", "generic_access", "heart_rate"],
      })

      device.addEventListener("gattserverdisconnected", onDisconnected)
      await setupDevice(device)
    } catch (error) {
      console.error("[v0] Erro na conexão Bluetooth:", error)
      if (error instanceof Error && error.name !== "NotFoundError") {
        alert(`Erro: ${error.message}`)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectBluetooth = async () => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect()
    }
    setBluetoothDevice(null)
    setBatteryLevel(null)
    deviceRef.current = null
  }

  const handleSOS = async () => {
    try {
      const res = await fetch("/api/sos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patrol_id: currentPatrolId,
          guard_id: guardInternalId,
          company_id: companyId,
          location: "Casa Silva - SOS",
          latitude: -25.9655,
          longitude: 32.5832,
          severity: "critical",
          description: "SOS acionado pelo guarda",
        }),
      })
      const data = await res.json()
      if (data.success) {
        console.log("[v0] SOS saved to DB:", data.sos)
        alert("🚨 SOS ENVIADO! Supervisores foram notificados.")
      }
    } catch (error) {
      console.error("[v0] Failed to send SOS:", error)
      alert("Erro ao enviar SOS. Tente novamente.")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto relative overflow-hidden">
      {/* Header Fixo */}
      <header className="p-4 glass sticky top-0 z-50 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
            <MapPin className="w-3 h-3 mr-1" /> Casa Silva
          </Badge>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold text-success">ONLINE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-tighter">{formatTime(timer)}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Battery className={cn("w-3 h-3", batteryLevel && batteryLevel < 20 && "text-destructive")} />
            <span className="text-[10px]">{batteryLevel !== null ? `${batteryLevel}%` : "87%"}</span>
          </div>
        </div>
      </header>

      {/* Main Content Areas based on Tabs */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "ronda" && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={isPatrolling ? "destructive" : "default"}
                className="h-28 flex flex-col gap-2 rounded-2xl shadow-lg transition-all active:scale-95"
                onClick={togglePatrol}
              >
                {isPatrolling ? (
                  <>
                    <RefreshCcw className="w-8 h-8" />
                    <span className="text-xs font-bold">PARAR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 fill-current" />
                    <span className="text-xs font-bold">INICIAR</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-28 flex flex-col gap-2 rounded-2xl glass shadow-lg transition-all active:scale-95 bg-transparent"
              >
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <span className="text-xs font-bold">PONTO OK</span>
              </Button>
              <Button
                variant="outline"
                className="h-28 flex flex-col gap-2 rounded-2xl glass shadow-lg transition-all active:scale-95 bg-transparent"
              >
                <QrCode className="w-8 h-8" />
                <span className="text-xs font-bold">QR CODE</span>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "h-28 flex flex-col gap-2 rounded-2xl glass shadow-lg transition-all active:scale-95",
                  isListening && "bg-ai/10 border-ai text-ai ai-glow",
                )}
                onClick={toggleListening}
              >
                <Mic className={cn("w-8 h-8", isListening && "animate-pulse")} />
                <span className="text-xs font-bold">IA VOZ</span>
              </Button>
              <Button
                variant="outline"
                className="h-28 flex flex-col gap-2 rounded-2xl glass shadow-lg transition-all active:scale-95 border-warning/50 bg-transparent"
              >
                <AlertTriangle className="w-8 h-8 text-warning" />
                <span className="text-xs font-bold">INCIDENTE</span>
              </Button>
              <Button
                variant="destructive"
                className="h-28 flex flex-col gap-2 rounded-2xl shadow-xl transition-all active:scale-95 bg-destructive/90"
                onClick={handleSOS}
              >
                <Zap className="w-8 h-8 fill-current" />
                <span className="text-xs font-bold">SOS</span>
              </Button>
            </div>

            {/* Rodapé IA */}
            <Card className="rounded-2xl border-ai/30 ai-glow overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-ai animate-pulse" />
                  <span className="text-xs font-bold text-ai uppercase tracking-wider">Guardian IA</span>
                </div>
                <p className="text-sm font-medium leading-tight">{aiAnalysis}</p>
                {lastTranscription && <p className="text-[10px] text-muted-foreground italic">"{lastTranscription}"</p>}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Cobertura 87%</span>
                    <span>🔥 92pts</span>
                  </div>
                  <Progress value={87} className="h-1.5 bg-ai/10" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "ia" && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="font-bold text-lg">Análises em Tempo Real</h2>
            <Card className="rounded-2xl border-ai/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-ai/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-ai" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Ronda Atual: 92% OK</p>
                    <p className="text-[10px] text-muted-foreground">1 anomalia detectada na porta lateral.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Sentimento: 😊 Normal (85%)</p>
                    <p className="text-[10px] text-muted-foreground">O tom de voz indica calma e prontidão.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="font-bold text-lg pt-2">Predições IA</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20">
                <p className="text-xs font-bold text-warning mb-1">ALERTA: 22h-23h</p>
                <p className="text-[10px]">Período de alto risco histórico para este local. Redobre a atenção.</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <p className="text-xs font-bold text-primary mb-1">FRAQUEZA: Portão Principal</p>
                <p className="text-[10px]">Detectadas 3 falhas de fechamento na última semana.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progresso" && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Seu Desempenho</h2>
              <Badge className="bg-primary">Rank #1/12</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center space-y-1">
                  <p className="text-2xl font-bold">92</p>
                  <p className="text-[10px] text-muted-foreground font-bold">PONTOS HOJE</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center space-y-1">
                  <p className="text-2xl font-bold text-primary">7</p>
                  <p className="text-[10px] text-muted-foreground font-bold">DIAS STREAK</p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl bg-gradient-to-br from-primary/10 to-ai/10 border-primary/20">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-bold">Bónus de Amanhã</span>
                </div>
                <p className="text-sm">Mantenha o Top 1 para ganhar 1.000 MZN extra!</p>
              </CardContent>
            </Card>

            <div className="space-y-2 pt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase">Ranking Semanal</p>
              {[
                { name: "Você (João)", pts: 92, active: true },
                { name: "Mussagi", pts: 88, active: false },
                { name: "António", pts: 85, active: false },
              ].map((guard, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border",
                    guard.active ? "bg-primary/5 border-primary/30" : "bg-card border-border",
                  )}
                >
                  <span className="text-sm font-medium">
                    {i + 1}. {guard.name}
                  </span>
                  <span className="text-sm font-bold">{guard.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "eu" && (
          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-primary overflow-hidden">
                <img src="/security-guard-face.jpg" alt="Guard" />
              </div>
              <div>
                <h2 className="font-bold text-lg">João Silva</h2>
                <Badge variant="outline" className="text-orange-500 border-orange-500/30">
                  Trial: 12/14 dias
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl glass transition-all cursor-pointer active:scale-95",
                  bluetoothDevice ? "border-success/50 bg-success/5" : "border-muted",
                )}
                onClick={!bluetoothDevice ? connectBluetooth : disconnectBluetooth}
              >
                <div className="flex items-center gap-3">
                  <Battery className={cn("w-5 h-5", bluetoothDevice ? "text-success" : "text-muted-foreground")} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{bluetoothDevice ? bluetoothDevice.name : "Óculos BT"}</span>
                    {bluetoothDevice && <span className="text-[10px] text-success animate-pulse">CONECTADO</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnecting ? (
                    <span className="text-xs animate-pulse text-primary font-bold">BUSCANDO...</span>
                  ) : (
                    <span
                      className={cn("text-sm font-bold", bluetoothDevice ? "text-success" : "text-muted-foreground")}
                    >
                      {bluetoothDevice ? `${batteryLevel !== null ? batteryLevel + "%" : "Pronto"}` : "Parear"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl glass">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Sincronização</span>
                </div>
                <span className="text-sm font-bold">Ativa</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl glass">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Nível IA</span>
                </div>
                <Badge className="bg-ai">PRO</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 bg-transparent"
            >
              Sair da Conta
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 glass border-t flex items-center justify-around px-6 z-50 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("ronda")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "ronda" ? "text-primary scale-110" : "text-muted-foreground",
          )}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] font-bold">RONDA</span>
        </button>
        <button
          onClick={() => setActiveTab("ia")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "ia" ? "text-ai scale-110" : "text-muted-foreground",
          )}
        >
          <Brain className="w-6 h-6" />
          <span className="text-[10px] font-bold">IA</span>
        </button>
        <button
          onClick={() => setActiveTab("progresso")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "progresso" ? "text-primary scale-110" : "text-muted-foreground",
          )}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] font-bold">PROGRESSO</span>
        </button>
        <button
          onClick={() => setActiveTab("eu")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "eu" ? "text-primary scale-110" : "text-muted-foreground",
          )}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">EU</span>
        </button>
      </nav>
    </div>
  )
}
