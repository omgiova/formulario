"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Brain, Clock, Calendar } from "lucide-react"

interface FormData {
  nomeCliente: string
  nomeBarbearia: string
  contatosDiarios: string
  ticketMedio: string
  whatsapp: string
  infoExtra: string
}

const questions = [
  {
    id: "nomeCliente",
    title: "Como podemos te chamar?",
    subtitle: "Queremos personalizar nossa conversa com você",
    placeholder: "Seu nome",
    type: "text",
  },
  {
    id: "nomeBarbearia",
    title: "Qual é o nome da sua barbearia?",
    subtitle: "Queremos conhecer melhor seu trabalho",
    placeholder: "Nome da sua barbearia",
    type: "text",
  },
  {
    id: "contatosDiarios",
    title: "Quantos clientes você atende no WhatsApp por dia, em média?",
    subtitle: "Isso nos ajuda a entender o volume do seu negócio",
    placeholder: "Ex: 15",
    type: "number",
    min: 1,
    max: 100,
  },
  {
    id: "ticketMedio",
    title: "Qual o valor médio dos seus serviços?",
    subtitle: "Considerando corte, barba e outros serviços",
    placeholder: "R$ 50",
    type: "currency",
  },
  {
    id: "infoExtra",
    title: "Nos conte mais sobre sua barbearia...",
    subtitle:
      "Dias e horários de funcionamento, maneiras atuais de marcar horário, promoções/combos, valores dos serviços e produtos",
    placeholder: "Ex: Trabalho de seg a sexta, das 8 às 20h. O corte é R$ 40 e a barba é R$ 20.",
    type: "text",
  },
  {
    id: "whatsapp",
    title: "Qual seu WhatsApp para enviarmos o teste gratuito?",
    subtitle: "Vamos criar um teste personalizado para você",
    placeholder: "(11) 99999-9999",
    type: "phone",
  },
]

export default function SalesFunnel() {
  const [showLanding, setShowLanding] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nomeCliente: "",
    nomeBarbearia: "",
    contatosDiarios: "",
    ticketMedio: "",
    whatsapp: "",
    infoExtra: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const footerVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const playVideo = async (videoRef: React.RefObject<HTMLVideoElement>, testName: string) => {
      if (videoRef.current) {
        try {
          console.log(`[v0] ${testName} - Attempting to play video`)
          videoRef.current.muted = true
          videoRef.current.loop = true
          await videoRef.current.play()
          console.log(`[v0] ${testName} - Video playing successfully`)
        } catch (error) {
          console.log(`[v0] ${testName} - Failed to play:`, error)
        }
      }
    }

    if (showLanding) {
      setTimeout(() => {
        playVideo(mainVideoRef, "Main Logo Video")
      }, 1000)
    } else {
      setTimeout(() => {
        playVideo(footerVideoRef, "Footer Video")
      }, 500)
    }
  }, [showLanding])

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isStepValid()) {
        handleNext()
      }
    }

    document.addEventListener("keypress", handleKeyPress)
    return () => document.removeEventListener("keypress", handleKeyPress)
  }, [currentStep, formData])

  const isValidBrazilianPhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, "")
    return numbers.length === 11
  }

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers.length > 0 ? `(${numbers}` : ""
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const testGoogleSheetsIntegration = async () => {
    console.log("[v0] Starting manual test of Google Sheets integration")

    const testData = {
      nomeCliente: "Teste Manual",
      nomeBarbearia: "Barbearia Teste",
      contatosDiarios: 25,
      ticketMedio: 50,
      whatsapp: "(11) 99999-9999",
      infoExtra: "Trabalho de seg a sexta, das 8 às 20h. O corte é R$ 40 e a barba é R$ 20.",
    }

    console.log("[v0] Test data to send:", testData)

    try {
      console.log("[v0] Trying JSON fetch method...")
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxP9AnY44cCMhFyogSBlTWj-c6CEdB7KTJX3lxn9uSjul4hs-jo3jCHJfHJA4UgPWDCAw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
          mode: "no-cors",
        },
      )
      console.log("[v0] JSON fetch response:", response)
      alert("Teste enviado via JSON! Verifique sua planilha.")
    } catch (error) {
      console.log("[v0] JSON fetch failed:", error)
      alert("Teste falhou. Verifique o console para detalhes.")
    }
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const dataToSend = {
        nomeCliente: formData.nomeCliente,
        nomeBarbearia: formData.nomeBarbearia,
        contatosDiarios: Number.parseInt(formData.contatosDiarios) || 0,
        ticketMedio: Number.parseInt(formData.ticketMedio.replace(/\D/g, "")) || 0,
        whatsapp: formData.whatsapp,
        infoExtra: formData.infoExtra,
      }

      console.log("[v0] Submitting form with formatted data:", dataToSend)

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxP9AnY44cCMhFyogSBlTWj-c6CEdB7KTJX3lxn9uSjul4hs-jo3jCHJfHJA4UgPWDCAw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
          mode: "no-cors",
        },
      )

      console.log("[v0] Data sent successfully via JSON fetch:", response)

      setTimeout(() => {
        setShowThankYou(true)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error sending data:", error)
      alert("Houve um problema ao enviar o formulário. Por favor, tente novamente.")
    }

    setIsSubmitting(false)
  }

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const limitedNumbers = numbers.slice(0, 3)
    if (limitedNumbers === "") return ""
    const numValue = Number.parseInt(limitedNumbers)
    return `R$ ${numValue}`
  }

  const currentValue = formData[currentQuestion.id as keyof FormData]

  const isStepValid = () => {
    if (currentQuestion.type === "currency") {
      const numbers = currentValue.replace(/\D/g, "")
      const numValue = Number.parseInt(numbers)
      return !isNaN(numValue) && numValue >= 10 && numValue <= 999
    }
    if (currentQuestion.type === "number") {
      const numValue = Number.parseInt(currentValue)
      return !isNaN(numValue) && numValue >= 1 && numValue <= 100
    }
    if (currentQuestion.type === "phone") {
      return isValidBrazilianPhone(currentValue)
    }
    return currentValue && currentValue.trim() !== ""
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-background cyber-grid">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="cyber-border neon-glow">
              <CardContent className="p-8 md:p-16 text-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <video
                        className="w-32 h-32 object-cover rounded-lg border border-emerald-400"
                        style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-HjVltp3zuvUu0ewDOYSrky1uhK14jO.mp4" type="video/mp4" />
                        <source src="/logo.mp4" type="video/mp4" />
                        Vídeo não disponível
                      </video>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text-cyan neon-text-glow text-balance">
                      Valeu, {formData.nomeCliente}!
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground text-pretty">
                      Recebemos suas informações e em breve entraremos em contato com seu teste personalizado do{" "}
                      <strong>Mr. Giobot</strong>
                    </p>
                  </div>

                  <div className="space-y-6 my-12">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold gradient-text-cyan">Quer acelerar o processo?</h3>
                      <p className="text-lg text-muted-foreground">
                        Agende agora mesmo uma conversa para implementar o piloto automático na sua barbearia com nossa
                        equipe especializada!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() =>
                        window.open(
                          "https://wa.me/5511986501499?text=Ol%C3%A1%21%20Quero%20implantar%20o%20Mr.%20Giobot%2C%20a%20m%C3%A1quina%20de%20agendamentos%2C%20na%20minha%20barbearia%21",
                          "_blank",
                        )
                      }
                      size="lg"
                      className="font-semibold px-12 py-6 text-xl shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, #04D29A 0%, #00B4D8 100%)",
                        color: "#00141c",
                        filter: "drop-shadow(0 0 8px #04D29A)",
                      }}
                    >
                      Agendar implantação agora
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (showLanding) {
    return (
      <div className="min-h-screen bg-background cyber-grid">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="cyber-border neon-glow">
              <CardContent className="p-8 md:p-16 text-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <video
                        ref={mainVideoRef}
                        className="w-32 h-32 object-cover rounded-lg border border-emerald-400"
                        style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                        onError={(e) => console.log("[v0] Main video error:", e)}
                        onLoadStart={() => console.log("[v0] Main video loading")}
                        onCanPlay={() => console.log("[v0] Main video can play")}
                      >
                        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-HjVltp3zuvUu0ewDOYSrky1uhK14jO.mp4" type="video/mp4" />
                        <source src="/logo.mp4" type="video/mp4" />
                        Vídeo não disponível
                      </video>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text-cyan neon-text-glow text-balance">
                      Mr. Giobot, o piloto automático do barbeiro
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground text-pretty">
                      Transforme sua barbearia em uma máquina de agendamentos
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center mx-auto">
                        <Brain className="w-8 h-8 text-blue-400" style={{ filter: "drop-shadow(0 0 8px #60a5fa)" }} />
                      </div>
                      <h3 className="text-lg font-semibold">Inteligente de VERDADE</h3>
                      <p className="text-muted-foreground">Entende gírias, áudios e erros de digitação, 24h por dia</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-green-400" style={{ filter: "drop-shadow(0 0 8px #4ade80)" }} />
                      </div>
                      <h3 className="text-lg font-semibold">Mais tempo PRA VOCÊ</h3>
                      <p className="text-muted-foreground">
                        Foque em fazer um corte perfeito e deixe a gente dar conta do seu atendimento
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center mx-auto">
                        <Calendar
                          className="w-8 h-8 text-pink-400"
                          style={{ filter: "drop-shadow(0 0 8px #f472b6)" }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold">Agenda sempre CHEIA</h3>
                      <p className="text-muted-foreground">Nunca mais perca um cliente por demorar pra responder</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      Responda algumas perguntas e receba seu teste grátis
                    </p>
                    <Button
                      onClick={() => setShowLanding(false)}
                      size="lg"
                      className="font-semibold px-12 py-6 text-xl shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, #04D29A 0%, #00B4D8 100%)",
                        color: "#00141c",
                        filter: "drop-shadow(0 0 8px #04D29A)",
                      }}
                    >
                      Começar
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <form
        ref={formRef}
        action="https://script.google.com/macros/s/AKfycbxP9AnY44cCMhFyogSBlTWj-c6CEdB7KTJX3lxn9uSjul4hs-jo3jCHJfHJA4UgPWDCAw/exec"
        method="POST"
        style={{ display: "none" }}
      >
        <input type="hidden" name="nomeCliente" />
        <input type="hidden" name="nomeBarbearia" />
        <input type="hidden" name="contatosDiarios" />
        <input type="hidden" name="ticketMedio" />
        <input type="hidden" name="whatsapp" />
        <input type="hidden" name="infoExtra" />
      </form>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300 neon-glow-green"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="cyber-border neon-glow">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text-cyan neon-text-glow text-balance">
                    {currentQuestion.title}
                  </h1>
                  <p className="text-lg text-muted-foreground text-pretty">{currentQuestion.subtitle}</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    {currentQuestion.type === "multiple-choice" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options?.map((option) => (
                          <Button
                            key={option.value}
                            variant={currentValue === option.value ? "default" : "outline"}
                            onClick={() => updateFormData(currentQuestion.id as keyof FormData, option.value)}
                            className={`h-16 text-lg cyber-border ${
                              currentValue === option.value
                                ? "bg-accent hover:bg-accent/90 text-white neon-glow-green font-semibold"
                                : "hover:bg-accent/10 text-foreground"
                            }`}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Input
                        id={currentQuestion.id}
                        placeholder={currentQuestion.placeholder}
                        value={currentValue}
                        type={currentQuestion.type === "number" ? "number" : "text"}
                        min={currentQuestion.type === "number" ? currentQuestion.min : undefined}
                        max={currentQuestion.type === "number" ? currentQuestion.max : undefined}
                        onChange={(e) => {
                          if (currentQuestion.type === "currency") {
                            const formatted = formatCurrency(e.target.value)
                            updateFormData(currentQuestion.id as keyof FormData, formatted)
                          } else if (currentQuestion.type === "phone") {
                            const formatted = formatPhone(e.target.value)
                            updateFormData(currentQuestion.id as keyof FormData, formatted)
                          } else if (currentQuestion.type === "number") {
                            const value = e.target.value
                            const numValue = Number.parseInt(value)
                            if (value === "" || (!isNaN(numValue) && numValue >= 1 && numValue <= 100)) {
                              updateFormData(currentQuestion.id as keyof FormData, value)
                            }
                          } else {
                            updateFormData(currentQuestion.id as keyof FormData, e.target.value)
                          }
                        }}
                        className="cyber-border text-lg p-6 h-16 text-center"
                        autoFocus
                      />
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    {currentStep > 0 ? (
                      <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                    ) : (
                      <div /> // Empty div to maintain spacing
                    )}

                    {isStepValid() && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <Button
                          onClick={handleNext}
                          disabled={isSubmitting}
                          size="lg"
                          className="bg-accent hover:bg-accent/90 text-white neon-glow-green font-semibold px-8"
                        >
                          {isSubmitting ? (
                            "Enviando..."
                          ) : currentStep === questions.length - 1 ? (
                            "Finalizar"
                          ) : (
                            <>
                              Próximo
                              <ChevronRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-30 right-30 p-2">
          <video
            ref={footerVideoRef}
            className="w-32 h-32 object-cover rounded-lg border border-emerald-400"
            style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
            onError={() => console.log("[v0] Footer video failed")}
            onLoadStart={() => console.log("[v0] Footer video loading")}
            onCanPlay={() => console.log("[v0] Footer video can play")}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-HjVltp3zuvUu0ewDOYSrky1uhK14jO.mp4" type="video/mp4" />
            <source src="/logo.mp4" type="video/mp4" />
            Vídeo não disponível
          </video>
        </div>
      </div>
    </div>
  )
}
