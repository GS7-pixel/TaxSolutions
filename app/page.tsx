import Link from "next/link"
import { Download, Shield, FileCheck, Clock, Phone, Mail, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-100px)] items-center py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-semibold leading-[1.1] tracking-tight md:text-[5rem]">
                Professional Tax<br />Software for<br />Accountants
              </h1>
              <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Streamline your tax preparation with our trusted desktop solution used by thousands of accounting professionals.
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="h-12 gap-2.5 rounded-lg px-6 text-base">
                  <a href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5" />
                    Download TaxSolution
                  </a>
                </Button>
                <p className="mt-5 text-sm text-muted-foreground/80">
                  Windows 10/11 • macOS 12+ • Free 30-day trial
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Built for accuracy and speed
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Everything you need to handle complex tax returns efficiently.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <Shield className="h-10 w-10 stroke-[1.5]" />
                <h3 className="text-xl font-semibold">IRS Certified</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fully compliant with current tax regulations and IRS e-file requirements.
                </p>
              </div>
              <div className="space-y-4">
                <FileCheck className="h-10 w-10 stroke-[1.5]" />
                <h3 className="text-xl font-semibold">Error Detection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced algorithms catch mistakes before filing, ensuring accuracy every time.
                </p>
              </div>
              <div className="space-y-4">
                <Clock className="h-10 w-10 stroke-[1.5]" />
                <h3 className="text-xl font-semibold">Save Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Process returns 3x faster with automated calculations and smart data import.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Get started today
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Download TaxSolution and transform how you handle tax preparation. No credit card required for trial.
                </p>
                <div className="mt-8 space-y-4">
                  <a href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer">
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
                            <Download className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">Windows Version</p>
                            <p className="text-sm text-muted-foreground">Version 2026.1 • 249 MB</p>
                          </div>
                        </div>
                        <span className="text-muted-foreground">→</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer">
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
                            <Download className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">macOS Version</p>
                            <p className="text-sm text-muted-foreground">Version 2026.1 • 249 MB</p>
                          </div>
                        </div>
                        <span className="text-muted-foreground">→</span>
                      </CardContent>
                    </Card>
                  </a>
                </div>
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">System Requirements</h3>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <li>• 4GB RAM minimum (8GB recommended)</li>
                      <li>• 500MB available disk space</li>
                      <li>• Internet connection for e-filing</li>
                      <li>• Display resolution 1280x720 or higher</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="relative space-y-4">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D1bMAHOUijIQet6rL3LMwce2pu8ZUo.png"
                  alt="Taxation Point office building"
                  className="rounded-xl shadow-2xl"
                />
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2gNs0sQg6bz5FIAYy34MQWGcUsDotQ.png"
                  alt="Office workspace with computers"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="bg-muted/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Expert support when you need it
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Our team of tax software specialists is available to help you succeed.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="mx-auto h-8 w-8 stroke-[1.5]" />
                  <h3 className="mt-4 text-lg font-semibold">Phone Support</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Monday-Friday, 8am-8pm ET
                  </p>
                  <p className="mt-2 font-medium">9811177902</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="mx-auto h-8 w-8 stroke-[1.5]" />
                  <h3 className="mt-4 text-lg font-semibold">Email Support</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Response within 24 hours
                  </p>
                  <p className="mt-2 font-medium">taxsolutions72@gmail.com</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="mx-auto h-8 w-8 stroke-[1.5]" />
                  <h3 className="mt-4 text-lg font-semibold">Live Chat</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Available during business hours
                  </p>
                  <p className="mt-2 font-medium">Start chat</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
