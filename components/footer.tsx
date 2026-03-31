import Link from "next/link";
import { Film } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  social: [
    { href: "https://github.com", label: "GitHub" },
    { href: "https://x.com", label: "X (Twitter)" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              <span className="font-brand text-xl">Cine List</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Track movies and shows by the people who make them. Powered by
              TMDB.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Social</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.social.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Cine List. All rights reserved.
          </p>
          <p>
            Data provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
