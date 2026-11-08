"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

const logo = (
  <Image
    src="/Images/logo.png"
    alt="HireLoop"
    width={154}
    height={44}
    priority
    className="h-9 w-auto lg:h-11"
  />
)

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-6">
      <nav
        aria-label="Main"
        className="flex h-16 w-full items-center justify-between gap-4 rounded-[16px] border border-white/[0.06] bg-nav pr-2 pl-4 shadow-[0_1px_2px_rgba(0,0,0,0.35)] lg:h-[74px] lg:gap-6 lg:pl-6"
      >
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {logo}
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md text-base text-white transition-colors outline-none hover:text-brand-soft focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-nav"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <span aria-hidden className="h-6 w-px bg-nav-muted/40" />

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-[52px] rounded-[12px] px-6 font-manrope text-lg font-semibold text-brand hover:bg-white/5 hover:text-brand-soft"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "h-[52px] rounded-[12px] border border-[#090a15]/10 bg-brand px-6 font-instrument text-lg font-medium text-white hover:bg-brand-soft"
              )}
            >
              Get Started
            </Link>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Open navigation menu"
                className="text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40 lg:hidden"
              />
            }
          >
            <Menu />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[min(88vw,360px)] gap-2 border-white/10 bg-[#141416] text-white data-[side=right]:w-[min(88vw,360px)]"
          >
            <SheetHeader className="flex-row items-center p-6 pb-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="HireLoop home"
                className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {logo}
              </Link>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg text-white transition-colors outline-none hover:bg-white/[0.06] hover:text-brand-soft focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <SheetFooter className="mt-auto gap-3 border-t border-white/10 p-6">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-12 w-full rounded-[12px] font-manrope text-base font-semibold text-brand hover:bg-white/5 hover:text-brand-soft"
                )}
              >
                Sign In
              </Link> 
              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants(),
                  "h-12 w-full rounded-[12px] border border-[#090a15]/10 bg-brand font-instrument text-base font-medium text-white hover:bg-brand-soft"
                )}
              >
                Get Started
              </Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
