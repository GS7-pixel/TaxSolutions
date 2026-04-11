import Link from "next/link"
import { FileCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          <span className="font-semibold">TaxSolution</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Documentation
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          © 2026 TaxSolution. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
