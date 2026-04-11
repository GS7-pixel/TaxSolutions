import Link from "next/link"
import { FileCheck } from "lucide-react"

export function Header() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#download", label: "Download" },
    { href: "#support", label: "Support" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3">
          <FileCheck className="h-9 w-9 stroke-[1.25]" />
          <span className="text-[2.25rem] font-normal tracking-tight leading-none">TaxSolution</span>
        </Link>
        <nav className="flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
