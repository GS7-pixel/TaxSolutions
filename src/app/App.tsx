import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Shield, FileCheck, Clock, BarChart3, TrendingUp, Users, Package, Zap, ShieldCheck, ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import gxsDashboard from "@/imports/image.png";
import gxsInvoices from "@/imports/image-1.png";
import gxsNewInvoice from "@/imports/image-2.png";
import gxsReports from "@/imports/image-3.png";

type Page = "home" | "gxs-overview" | "gxs-features";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="size-8" />
            <span className="text-[2rem] tracking-tight">TaxSolution</span>
          </div>
          <div className="flex items-center gap-8">
            {page !== "home" && (
              <button
                onClick={() => setPage("home")}
                className="flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            )}
            <a href="#features" onClick={() => setPage("home")} className="text-foreground/70 hover:text-foreground transition-colors">Features</a>
            <a href="#download" onClick={() => setPage("home")} className="text-foreground/70 hover:text-foreground transition-colors">Download</a>
            <button
              onClick={() => setPage("gxs-overview")}
              className={`flex items-center gap-1.5 transition-colors ${page !== "home" ? "text-foreground font-medium" : "text-foreground/70 hover:text-foreground"}`}
            >
              <BarChart3 className="size-4" />
              GXS
              <span className="text-[0.6rem] bg-foreground text-background px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">New</span>
            </button>
            <a href="#support" onClick={() => setPage("home")} className="text-foreground/70 hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </nav>

      {page === "home" && <HomePage setPage={setPage} />}
      {page === "gxs-overview" && <GXSOverviewPage setPage={setPage} />}
      {page === "gxs-features" && <GXSFeaturesPage />}
    </div>
  );
}

/* ── HOME PAGE (original layout preserved) ── */
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Hero Section - Full Bleed */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554224311-beee460ae6fb"
            alt="Professional accounting workspace"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-[4.5rem] leading-[1.1] tracking-tight mb-6">
              Professional Tax Software for Accountants
            </h1>
            <p className="text-[1.25rem] text-foreground/70 mb-8 max-w-xl">
              Streamline your tax preparation with our trusted desktop solution used by thousands of accounting professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] shadow-lg hover:shadow-xl transition-shadow"
              >
                <Download className="size-5" />
                Download TaxSolution
              </motion.a>
              <motion.a
                href="https://github.com/GS7-pixel/GXS-Sales-Management/releases/latest/download/GXS-Setup.exe"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-background border border-border text-foreground px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] hover:bg-muted/50 transition-colors"
              >
                <Download className="size-5" />
                Download GXS
              </motion.a>
            </div>
            <p className="mt-4 text-sm text-foreground/50">Windows 10/11 • macOS 12+ • Free 30-day trial</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[3rem] tracking-tight mb-4 text-center">Built for accuracy and speed</h2>
          <p className="text-center text-foreground/70 mb-20 text-[1.125rem]">Everything you need to handle complex tax returns efficiently.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <Shield className="size-12 text-primary" />
              <h3 className="text-[1.5rem]">IRS Certified</h3>
              <p className="text-foreground/70">Fully compliant with current tax regulations and IRS e-file requirements.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <FileCheck className="size-12 text-primary" />
              <h3 className="text-[1.5rem]">Error Detection</h3>
              <p className="text-foreground/70">Advanced algorithms catch mistakes before filing, ensuring accuracy every time.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <Clock className="size-12 text-primary" />
              <h3 className="text-[1.5rem]">Save Time</h3>
              <p className="text-foreground/70">Process returns 3x faster with automated calculations and smart data import.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[3rem] tracking-tight mb-6">Get started today</h2>
              <p className="text-foreground/70 mb-8 text-[1.125rem]">Download TaxSolution and transform how you handle tax preparation. No credit card required for trial.</p>

              <div className="space-y-4">
                <motion.a
                  href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="size-5" />
                    <div className="text-left">
                      <div className="text-[1rem]">Windows Version</div>
                      <div className="text-sm text-primary-foreground/70">Version 2026.1 • 249 MB</div>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </motion.a>

                <motion.a
                  href="https://github.com/GS7-pixel/TaxSolutions/releases/tag/v1.0.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="w-full bg-secondary text-secondary-foreground px-6 py-4 rounded-lg flex items-center justify-between group border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Download className="size-5" />
                    <div className="text-left">
                      <div className="text-[1rem]">macOS Version</div>
                      <div className="text-sm text-secondary-foreground/70">Version 2026.1 • 249 MB</div>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </motion.a>
              </div>

              <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
                <h4 className="mb-3">System Requirements</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• 4GB RAM minimum (8GB recommended)</li>
                  <li>• 500MB available disk space</li>
                  <li>• Internet connection for e-filing</li>
                  <li>• Display resolution 1280x720 or higher</li>
                </ul>
              </div>

              {/* GXS Download Block */}
              <div className="mt-10 pt-10 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="size-5" />
                  <span className="text-[1.25rem] tracking-tight">GXS</span>
                  <span className="text-[0.6rem] bg-foreground text-background px-1.5 py-0.5 rounded uppercase tracking-wider leading-none ml-1">New</span>
                </div>
                <p className="text-foreground/70 mb-5 text-sm">Our new sales management software — built for the same precision you expect from TaxSolution.</p>

                <div className="space-y-3">
                  <motion.a
                    href="https://github.com/GS7-pixel/GXS-Sales-Management/releases/latest/download/GXS-Setup.exe"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="size-5" />
                      <div className="text-left">
                        <div className="text-[1rem]">Download GXS — Windows</div>
                        <div className="text-sm text-primary-foreground/70">Version 1.0 • 98 MB</div>
                      </div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </motion.a>

                  <motion.button
                    whileHover={{ x: 4 }}
                    disabled
                    className="w-full bg-secondary text-secondary-foreground px-6 py-4 rounded-lg flex items-center justify-between group border border-border opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="size-5" />
                      <div className="text-left">
                        <div className="text-[1rem]">Download GXS — macOS</div>
                        <div className="text-sm text-secondary-foreground/70">Coming soon</div>
                      </div>
                    </div>
                    <span>&rarr;</span>
                  </motion.button>
                </div>

                <button
                  onClick={() => setPage("gxs-overview")}
                  className="mt-4 flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Learn about GXS
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="relative space-y-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D1bMAHOUijIQet6rL3LMwce2pu8ZUo.png"
                alt="Taxation Point office building"
                className="rounded-xl shadow-2xl w-full object-cover"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2gNs0sQg6bz5FIAYy34MQWGcUsDotQ.png"
                alt="Office workspace with computers"
                className="rounded-xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="py-32 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[3rem] tracking-tight mb-6">Expert support when you need it</h2>
          <p className="text-foreground/70 mb-12 text-[1.125rem]">Our team of tax software specialists is available to help you succeed.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="mb-2">Phone Support</h4>
              <p className="text-foreground/70 text-sm mb-3">Monday-Friday, 8am-8pm ET</p>
              <p className="text-primary">9811177270</p>
            </div>

            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="mb-2">Email Support</h4>
              <p className="text-foreground/70 text-sm mb-3">Response within 24 hours</p>
              <p className="text-primary">gauravsethi.ggn@gmail.com</p>
            </div>

            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="mb-2">Live Chat</h4>
              <p className="text-foreground/70 text-sm mb-3">Available during business hours</p>
              <p className="text-primary">Start chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <FileCheck className="size-6" />
              <span className="text-[1.25rem] tracking-tight">TaxSolution</span>
            </div>
            <div className="flex gap-8 text-sm text-foreground/70">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            </div>
            <p className="text-sm text-foreground/50">© 2026 TaxSolution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ── GXS PAGE 1: Overview ── */
function GXSOverviewPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* Hero — text left, dashboard screenshot right */}
      <section className="pt-32 pb-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="size-6" />
                <span className="text-[1.5rem] tracking-tight">GXS</span>
                <span className="text-[0.6rem] bg-foreground text-background px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">New</span>
              </div>
              <h1 className="text-[4rem] leading-[1.1] tracking-tight mb-6">
                Sales Management,
                <br />Built for Precision.
              </h1>
              <p className="text-[1.125rem] text-foreground/70 mb-8 max-w-lg">
                GXS brings the same rigor you trust in TaxSolution to your entire sales operation — invoices, pipeline, payments, and GST reports in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="https://github.com/GS7-pixel/GXS-Sales-Management/releases/latest/download/GXS-Setup.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Download className="size-5" />
                  Download GXS
                </motion.a>
                <motion.button
                  onClick={() => setPage("gxs-features")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-background border border-border text-foreground px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] hover:bg-muted/50 transition-colors"
                >
                  See all features
                  <ChevronRight className="size-5" />
                </motion.button>
              </div>
              <p className="mt-4 text-sm text-foreground/50">Windows 10/11 • Free 30-day trial</p>
            </motion.div>

            {/* Dashboard screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
                <ImageWithFallback
                  src={gxsDashboard}
                  alt="GXS Dashboard showing sales trend, revenue trend, outstanding payments and recent invoices"
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-xl bg-muted border border-border" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 mt-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "40%", label: "Average revenue uplift" },
            { value: "3×", label: "Faster deal closure" },
            { value: "99.7%", label: "Data accuracy rate" },
            { value: "<2s", label: "Report generation" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-[2.5rem] leading-none tracking-tight mb-2">{value}</p>
              <p className="text-sm text-primary-foreground/60">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature rows — alternating screenshot + text */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-32">

          {/* Row 1: Sales Invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden border border-border shadow-xl"
            >
              <ImageWithFallback
                src={gxsInvoices}
                alt="GXS Sales Invoices list with party names, amounts, and status badges"
                className="w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Package className="size-12 text-primary" />
              <h3 className="text-[2rem] tracking-tight">Sales Invoicing</h3>
              <p className="text-foreground/70 text-[1.125rem] leading-relaxed">
                Every sale in one list — invoice number, date, party, tax breakdown, and payment status at a glance. Filter by type, search by party, and issue new invoices in seconds.
              </p>
              <ul className="space-y-2 pt-2">
                {["Tax Invoice & Credit Note support", "GST-split: CGST / SGST / IGST", "Pending, Paid, Cancelled status tracking", "Export to Excel or PDF"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                    <CheckCircle className="size-4 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Row 2: New Invoice */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 space-y-4"
            >
              <TrendingUp className="size-12 text-primary" />
              <h3 className="text-[2rem] tracking-tight">New Invoice in Seconds</h3>
              <p className="text-foreground/70 text-[1.125rem] leading-relaxed">
                Add products with HSN codes, units, quantities, rates, and GST — everything auto-calculated. Print, save as PDF, or share directly from the invoice screen.
              </p>
              <ul className="space-y-2 pt-2">
                {["HSN code & unit selection", "Auto GST calculation per line item", "Disc % and Disc Amount fields", "Print · Save PDF · Share"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                    <CheckCircle className="size-4 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 rounded-xl overflow-hidden border border-border shadow-xl"
            >
              <ImageWithFallback
                src={gxsNewInvoice}
                alt="GXS New Invoice form with product lines, HSN, quantity, rate and GST fields"
                className="w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Row 3: Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden border border-border shadow-xl"
            >
              <ImageWithFallback
                src={gxsReports}
                alt="GXS GST Summary report showing GSTIN-wise taxable value, CGST, SGST, IGST and invoice totals"
                className="w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <BarChart3 className="size-12 text-primary" />
              <h3 className="text-[2rem] tracking-tight">GST Reports</h3>
              <p className="text-foreground/70 text-[1.125rem] leading-relaxed">
                GST Summary, GSTR-1, GSTR-2 and more — broken down by GSTIN, with CGST, SGST, and IGST columns. Date-range filtering and one-click Excel export.
              </p>
              <ul className="space-y-2 pt-2">
                {["Sale Register & GST Summary", "GSTIN-wise tax breakdown", "Party Ledger & Stock Summary", "Export GSTR-1 / GSTR-2 to Excel"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                    <CheckCircle className="size-4 shrink-0 text-primary" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA to features page */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-[2rem] tracking-tight mb-2">See the full feature breakdown</h3>
            <p className="text-foreground/60">How GXS compares to generic CRM tools — side by side.</p>
          </div>
          <button
            onClick={() => setPage("gxs-features")}
            className="flex items-center gap-2 border border-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-foreground hover:text-background transition-colors shrink-0"
          >
            GXS deep dive
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <GXSFooter />
    </>
  );
}

/* ── GXS PAGE 2: Features deep-dive ── */
function GXSFeaturesPage() {
  const comparison = [
    { feature: "Lead capture & tracking", gxs: true, generic: true },
    { feature: "GST-compliant invoice generation", gxs: true, generic: false },
    { feature: "TaxSolution sync", gxs: true, generic: false },
    { feature: "Audit log with timestamps", gxs: true, generic: false },
    { feature: "Multi-GSTIN support", gxs: true, generic: false },
    { feature: "Offline mode", gxs: true, generic: false },
    { feature: "Sales analytics dashboard", gxs: true, generic: true },
    { feature: "Role-based access control", gxs: true, generic: true },
  ];

  return (
    <>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-5" />
              <span className="text-lg tracking-tight">GXS · Feature Breakdown</span>
            </div>
            <h1 className="text-[4rem] leading-[1.1] tracking-tight mb-6 max-w-2xl">
              Accuracy and speed,
              <br />not a trade-off.
            </h1>
            <p className="text-foreground/60 max-w-md text-[1.1rem] leading-relaxed mb-12">
              GXS was designed for one purpose: give accounting firms a sales tool that matches the precision of their financial work.
            </p>
          </motion.div>

          {/* Full-width dashboard screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-xl overflow-hidden border border-border shadow-2xl"
          >
            <ImageWithFallback
              src={gxsDashboard}
              alt="GXS Dashboard — sales trend, revenue trend, outstanding payments and recent invoices"
              className="w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Speed vs Accuracy panels */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border p-10 bg-muted/30"
          >
            <Zap className="size-10 mb-6 text-primary" />
            <h2 className="text-[2rem] tracking-tight mb-4">Built for speed</h2>
            <p className="text-foreground/60 leading-relaxed mb-8">
              GXS processes sales data at the same speed your tax team expects from reconciliation software. Pipeline views load in under 200ms. Reports in under 2 seconds — even for datasets spanning 5 years.
            </p>
            <ul className="space-y-3">
              {[
                "Sub-200ms pipeline load times",
                "Bulk import: 10,000 leads in under 8 seconds",
                "Real-time sync across all devices",
                "Optimised for low-bandwidth connections",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/70">
                  <CheckCircle className="size-4 shrink-0 mt-0.5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border p-10 bg-primary text-primary-foreground"
          >
            <ShieldCheck className="size-10 mb-6 text-primary-foreground/70" />
            <h2 className="text-[2rem] tracking-tight mb-4">Built for accuracy</h2>
            <p className="text-primary-foreground/60 leading-relaxed mb-8">
              Every sale, quote, and interaction is validated at the data layer. GXS enforces field-level integrity rules so your CRM never has the ghost entries, duplicate leads, or silent errors that plague generic tools.
            </p>
            <ul className="space-y-3">
              {[
                "99.7% data accuracy out of the box",
                "Duplicate detection on import",
                "Field-level validation rules",
                "Complete audit trail for every record",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-primary-foreground/70">
                  <CheckCircle className="size-4 shrink-0 mt-0.5 text-primary-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 bg-muted/30 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[3rem] tracking-tight mb-4">GXS vs. generic CRM</h2>
          <p className="text-foreground/60 mb-12 text-[1.125rem]">Built specifically for accounting firms — not adapted from a generic sales tool.</p>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_120px] bg-muted px-6 py-3 text-xs uppercase tracking-widest text-foreground/50 border-b border-border">
              <span>Feature</span>
              <span className="text-center">GXS</span>
              <span className="text-center">Generic CRM</span>
            </div>
            {comparison.map(({ feature, gxs, generic }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-[1fr_120px_120px] px-6 py-4 text-sm items-center ${i % 2 === 0 ? "bg-background" : "bg-muted/20"} border-b border-border last:border-0`}
              >
                <span className="text-foreground/80">{feature}</span>
                <span className="text-center">
                  {gxs ? <CheckCircle className="size-4 mx-auto text-primary" /> : <span className="text-foreground/20">—</span>}
                </span>
                <span className="text-center">
                  {generic ? <CheckCircle className="size-4 mx-auto text-foreground/40" /> : <span className="text-foreground/20">—</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[3rem] tracking-tight mb-6">Download GXS today.<br />Free 30-day trial.</h2>
          <p className="text-foreground/60 mb-12 text-[1.125rem]">No credit card required. Full feature access during trial. Works on Windows 10/11.</p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://github.com/GS7-pixel/GXS-Sales-Management/releases/latest/download/GXS-Setup.exe"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] shadow-lg hover:shadow-xl transition-shadow"
            >
              <Download className="size-5" />
              Download GXS — Windows
            </motion.a>
            <motion.button
              disabled
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-secondary text-secondary-foreground border border-border px-8 py-4 rounded-lg flex items-center gap-3 text-[1.125rem] opacity-50 cursor-not-allowed"
            >
              <Download className="size-5" />
              macOS — Coming Soon
            </motion.button>
          </div>
          <p className="mt-6 text-sm text-foreground/40">Version 1.0 · 98 MB · Released June 2026</p>
        </div>
      </section>

      <GXSFooter />
    </>
  );
}

function GXSFooter() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FileCheck className="size-5" />
              <span className="text-[1.1rem] tracking-tight">TaxSolution</span>
            </div>
            <span className="text-foreground/20">·</span>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              <span className="text-[1.1rem] tracking-tight">GXS</span>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-foreground/70">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          </div>
          <p className="text-sm text-foreground/50">© 2026 TaxSolution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}