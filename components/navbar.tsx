"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-brand text-2xl">Cine List</span>
        </Link>

        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="hidden sm:inline-flex"
                variant="default"
              >
                Get Started
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            {!isDashboard && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}
            <UserButton />
          </Show>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="font-brand text-2xl flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                Cine List
              </SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {!isDashboard &&
                  navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <Button className="mt-4 w-full">Get Started</Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  {!isDashboard && (
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                  )}
                  <div className="mt-4">
                    <UserButton />
                  </div>
                </Show>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
